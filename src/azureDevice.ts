const assert = require('assert');
import { Client, DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';
import logger from './logger';
import track from './tracker';
import eventBus from './eventBus';
import constants from './constants';

const INFO = constants.logTypes.INFO;
const ERROR = constants.logTypes.ERROR;

let state: String = constants.serverStates.REQUESTS_ALLOWED;
 
assert(process.env.AZURE_IOT_CONNECTION_STRING, 'AZURE_IOT_CONNECTION_STRING required');
const client = Client.fromConnectionString(process.env.AZURE_IOT_CONNECTION_STRING, Mqtt);

const ring = (request: DeviceMethodRequest, response: DeviceMethodResponse): void => {
  logger.info(`request: ${JSON.stringify(request)}`);
  track(INFO, 'label', `ring called - state: ${state}`);
  if (state === constants.serverStates.REQUESTS_BLOCKED) {
    response.send(403, 'service is muted or shutoff', err => {
      if (err) {
        track(ERROR, 'blocked - response.send',`error: ${err.toString()}`);
      } else {
        track(INFO, 'blocked - response.send', `state: ${state} - unable to call: ${request.methodName}`);
      }
    });
  } else {
    eventBus.emit(constants.events.BELL_RING, request.methodName);
    response.send(200, 'ringDoorBell successfully called', err => {
      if (err) {
        track(ERROR, 'avail - response.send', `error: ${err.toString()}`);
      } else {
        track(INFO, 'avail - response.send', `Success calling: ${request.methodName}`);
      }
    });
  }
};

const mute = () => {
  turnOff();
  setTimeout(turnOn, 60000);
};

const turnOff = () => {
  if (state === constants.serverStates.REQUESTS_ALLOWED) {
    track(INFO, 'turnOff','called successfully');
    state = constants.serverStates.REQUESTS_BLOCKED;
  } else {
    track(INFO, 'turnOff', `cannot change state - state already: ${state}`);
  }
};

const turnOn = () => {
  if (state === constants.serverStates.REQUESTS_BLOCKED) {
    track(INFO, 'turnOn', 'called successfully');
    state = constants.serverStates.REQUESTS_ALLOWED;
  } else {
    track(INFO, 'turnOn', `cannot change state - state already: ${state}`);

  }
};

const healthCheckPing = () => {
  track(INFO, 'healthCheckPing', 'called successfully');
}

const connectCallback = function(err) {
  if (err) {
    track(ERROR, 'connectionFailed', 'Could not connect: ' + err.message);
  } else {
    client.onDeviceMethod(constants.requests.BACK_GATE_BELL, ring);
    client.onDeviceMethod(constants.requests.FRONT_GATE_BELL, ring);
    client.onDeviceMethod(constants.requests.OTHER_BELL, ring);
    client.onDeviceMethod(constants.requests.MUTE_INTERVAL, mute);
    client.onDeviceMethod(constants.requests.TURN_OFF, turnOff);
    client.onDeviceMethod(constants.requests.TURN_ON, turnOn);
    client.onDeviceMethod(constants.requests.HEALTH_CHECK_PING, healthCheckPing);

    track(INFO, 'connectionSuccess', 'ready to receive invocation requests');

    const sendInterval = setInterval(() => {
     track(INFO, 'healthCheck', 'doorbellReceiver connected');

    }, 60000); // 1 minute

    client.on('error', (err) => {
      track(ERROR, 'connectionFailed', `client error: ${err.message}`);
    });

    client.on('disconnect', () => {
      track(ERROR, 'connectionFailed', 'disconnect occurred - trying to reconnect');
      clearInterval(sendInterval);
      client.removeAllListeners();
      setTimeout(() => client.open(connectCallback), 180000); //3 minutes
    });
  }
};

const listenForInvokedMethods = (): void => {
  client.open(connectCallback);
};

export default listenForInvokedMethods;
