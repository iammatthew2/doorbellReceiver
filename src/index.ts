require('dotenv').config();
import eventBus from './eventBus';
import constants from './constants';
import listen from './azureDevice';
import playChime from './play';
import track from './tracker';

listen();
eventBus.on(constants.events.BELL_RING, e => {
  playChime(e);
});

track(constants.logTypes.INFO, 'doorbellReceiver is up and running');

