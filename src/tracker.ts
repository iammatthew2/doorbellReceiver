const assert = require('assert');
const appInsights = require('applicationinsights');
import logger from './logger';
import constants from './constants';

assert(process.env.INSTRUMENTATION_KEY, 'INSTRUMENTATION_KEY required');
appInsights.setup(process.env.INSTRUMENTATION_KEY);
appInsights.start();

const trackingClient = appInsights.defaultClient;

function track(type, event) {
  trackingClient.trackEvent({name: type, properties: { message: event }});
  logger[type](event);
}

track(constants.logTypes.INFO, 'appInsights initialized');

export default track;