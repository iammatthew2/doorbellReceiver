require('dotenv').config();
import eventBus from './eventBus';
import constants from './constants';
import logger from './logger';
import listen from './azureDevice';
import playChime from './play';

listen();
eventBus.on(constants.events.BELL_RING, e => {
  console.log(`this is the e: ${e}`);
  playChime(e);
});

logger.info('doorbellReceiver is up and running');

