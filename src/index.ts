require('dotenv').config();
import eventBus from './eventBus';
import constants from './constants';
import logger from './logger';
import playChime from './play';
import listen from './azureIotDevice';

listen();
eventBus.on(constants.events.BELL_RING, playChime);
logger.info('doorbellReceiver is up and running');
