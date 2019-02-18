const assert = require('assert');
const appInsights = require('applicationinsights');
import logger from './logger';
import constants from './constants';
assert(process.env.INSTRUMENTATION_KEY, 'INSTRUMENTATION_KEY required');
appInsights.setup(process.env.INSTRUMENTATION_KEY);
appInsights.start();

const trackingClient = appInsights.defaultClient;

function track(type, label, event): void {
  logger[type](`${event} - ${label}`);
  try {
    trackingClient.trackEvent({ name: label, properties: { message: event }});
  } catch(e) {
    logger.error(`failed to fire tracking - error: ${e}`);
  }
}

// one minute
setInterval(() => {
  // todo: get rid of this or the other healthchck in azureDevice.ts
  track(constants.logTypes.INFO, 'healthCheck', 'doorbellReceiver');
}, 60000);


logger.info('appInsights initialized');

export default track;