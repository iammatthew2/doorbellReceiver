require('dotenv').config();
import track from './tracker';
import eventBus from './eventBus';
import constants from './constants';
import { listenForInvokedMethods, turnOff, turnOn } from './azureDevice';
import playChime from './play';
import runScheduler from './cronJobs';

runScheduler()
listenForInvokedMethods();

eventBus.on(constants.events.BELL_RING, e => playChime(e));
eventBus.on(constants.events.CRON_BED_TIME, turnOff);
eventBus.on(constants.events.CRON_MORNING_TIME, turnOn);

track(constants.logTypes.INFO, 'startup', 'doorbellReceiver');
