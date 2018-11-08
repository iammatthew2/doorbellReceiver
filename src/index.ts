require('dotenv').config();
import track from './tracker';
import eventBus from './eventBus';
import constants from './constants';
import listen from './azureDevice';
import playChime from './play';

listen();
eventBus.on(constants.events.BELL_RING, e => {
  playChime(e);
});

track(constants.logTypes.INFO, 'startup', 'doorbellReceiver');
