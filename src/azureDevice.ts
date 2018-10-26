const assert = require('assert');
import { Client, DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';
import logger from './logger';
import eventBus from './eventBus';
import constants from './constants';

assert(process.env.AZURE_IOT_CONNECTION_STRING, 'AZURE_IOT_CONNECTION_STRING required');
const client = Client.fromConnectionString(process.env.AZURE_IOT_CONNECTION_STRING, Mqtt);

const ring = (request: DeviceMethodRequest, response: DeviceMethodResponse): void => {
  eventBus.emit(constants.events.BELL_RING, request.methodName);
  response.send(200, 'ringDoorBell successfully called', (err) => {
    if (err) {
      console.error(`error: ${err.toString()}`);
    } else {
      console.log(`Success calling: ${request.methodName}`);
    }
  });
}

const listenForInvokedMethods = (): void => {
  client.onDeviceMethod(constants.sources.BACK_GATE_BELL, ring);
  client.onDeviceMethod(constants.sources.FRONT_GATE_BELL, ring);
  client.onDeviceMethod(constants.sources.OTHER_BELL, ring);

  logger.info('ready to receive invocation requests');
}

export default listenForInvokedMethods;
 