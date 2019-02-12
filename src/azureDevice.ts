const assert = require('assert');
import { Client, DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';
import logger from './logger';
import track from './tracker';
import eventBus from './eventBus';
import constants from './constants';

const INFO = constants.logTypes.INFO;
const ERROR = constants.logTypes.ERROR;
const oneMinute = 1000 * 60;

let requestState: String = constants.serverStates.REQUESTS_ALLOWED;
let failedConnectionAttempts: number;

function resetConnectionHelper() {
  failedConnectionAttempts = 0;
}

resetConnectionHelper();

assert(process.env.AZURE_IOT_CONNECTION_STRING, 'AZURE_IOT_CONNECTION_STRING required');
const client = Client.fromConnectionString(process.env.AZURE_IOT_CONNECTION_STRING, Mqtt);

/**
 * Ring one of the bells
 */
const ring = (request: DeviceMethodRequest, response: DeviceMethodResponse): void => {
  logger.info(`request: ${JSON.stringify(request)}`);
  if (requestState === constants.serverStates.REQUESTS_BLOCKED) {
    response.send(403, 'service is muted or shutoff', err => {
      if (err) {
        track(ERROR, 'blocked - response.send',`error: ${err.toString()}`);
      } else {
        track(INFO, 'blocked - response.send', `state: ${requestState} - unable to call: ${request.methodName}`);
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

/**
 * Temporarily prevent requests from triggering the bell
 */
const mute = (request?: DeviceMethodRequest, response?: DeviceMethodResponse): void => {
  turnOff();
  setTimeout(turnOn, oneMinute * 30);

  if (response) {
    response.send(204, `mute successfully called - duration: ${oneMinute * 30} ms`, err => {
      if (err) {
        track(ERROR, 'mute response - response.send', `error: ${err.toString()}`);
      }
    });
  }
};

/**
 * Prevent requests from triggering the bell
 * We export this here for the cron job scheduler
 */
export const turnOff = (request?: DeviceMethodRequest, response?: DeviceMethodResponse): void => {
  if (requestState === constants.serverStates.REQUESTS_ALLOWED) {
    track(INFO, 'turnOff','called successfully');
    requestState = constants.serverStates.REQUESTS_BLOCKED;

    if (response) {
      response.send(204, 'turnOff successfully called', err => {
        if (err) {
          track(ERROR, 'turnOff response - response.send', `error: ${err.toString()}`);
        }
      });
    }
  } else {
    track(INFO, 'turnOff', `cannot change state - state already: ${requestState}`);
    if (response) {
      response.send(202, `cannot change state - state already: ${requestState}`, err => {
        if (err) {
          track(ERROR, 'turnOff response - response.send', `error: ${err.toString()}`);
        }
      });
    }
  }
};

/**
 * Enable requests to trigger the bell
 * We export this here for the cron job scheduler
 */
export const turnOn = (request?: DeviceMethodRequest, response?: DeviceMethodResponse): void => {
  if (requestState === constants.serverStates.REQUESTS_BLOCKED) {
    track(INFO, 'turnOn','called successfully');
    requestState = constants.serverStates.REQUESTS_ALLOWED;

    if (response) {
      response.send(204, 'turnOn successfully called', err => {
        if (err) {
          track(ERROR, 'turnOn response - response.send', `error: ${err.toString()}`);
        }
      });
    }
  } else {
    track(INFO, 'turnOn', `cannot change state - state already: ${requestState}`);
    if (response) {
      response.send(202, `cannot change state - state already: ${requestState}`, err => {
        if (err) {
          track(ERROR, 'turnOn response - response.send', `error: ${err.toString()}`);
        }
      });
    }
  }
};

/**
 * A helper method to test the health of the doorbellReceiver API
 * This essentially acts as a quiet bell 
 */
const healthCheckPing = (request: DeviceMethodRequest, response: DeviceMethodResponse): void => {
  track(INFO, 'healthCheckPing', 'called successfully');

  response.send(204, 'healthCheckPing successfully called', err => {
    if (err) {
      track(ERROR, 'healthCheckPing response - response.send', `error: ${err.toString()}`);
    }
  });
};

/**
 * Connect to the Azure IoT Hub
 * @param err - an error thrown by client.open()
 */
const connectCallback = (err) => {
  if (err) {
    logger.error(`connectionFailed - could not connect: ${err}`);
    failedConnectionAttempts ++;
    tryToConnect();
  } else {
    client.onDeviceMethod(constants.requests.BACK_GATE_BELL, ring);
    client.onDeviceMethod(constants.requests.FRONT_GATE_BELL, ring);
    client.onDeviceMethod(constants.requests.OTHER_BELL, ring);
    client.onDeviceMethod(constants.requests.MUTE_INTERVAL, mute);
    client.onDeviceMethod(constants.requests.TURN_OFF, turnOff);
    client.onDeviceMethod(constants.requests.TURN_ON, turnOn);
    client.onDeviceMethod(constants.requests.HEALTH_CHECK_PING, healthCheckPing);

    resetConnectionHelper();

    track(INFO, 'connectionSuccess', 'ready to receive invocation requests');

    const sendInterval = setInterval(() => {
     track(INFO, 'healthCheck', 'doorbellReceiver connected');
    }, oneMinute);

    client.on('error', (err) => {
      logger.error(`unknownError - client error: ${err.message}`);
    });

    client.on('disconnect', () => {
      logger.error('connectionFailed - disconnect occurred - trying to reconnect');
      clearInterval(sendInterval);
      client.removeAllListeners();
      tryToConnect();
    });
  }
};

/**
 * Attempt to connect to Azure
 * If we cannot connect after a few attempts, assume wifi is off for the evening
 * and try again later repeatedly until connect
 */
const tryToConnect = () => {
  let delay;
  if (failedConnectionAttempts < 3) {
    delay = 0
  } else if (failedConnectionAttempts === 3) {
    delay = oneMinute * 360 // wait six hours
  } else {
    delay = oneMinute * 10;
  }
  logger.info(`tryToConnect - will try to connect with the hub in: ${delay} ms`);
  setTimeout(() => client.open(connectCallback), delay);
}

export const listenForInvokedMethods = (): void => {
  tryToConnect();
};