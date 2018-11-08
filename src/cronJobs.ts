import eventBus from './eventBus';
import constants from './constants';


const CronJob = require('cron').CronJob;

/*
Cronjob example times:
  midnight: '0 0 * * *'
  6:40pm: '40 18 * * *'
  9:20am: '20 9 * * *'
*/

// 8:45am
const bedTimeJob = new CronJob('45 20 * * *', () =>
  eventBus.emit(constants.events.CRON_BED_TIME));

// 7:45am
const morningTimeJob = new CronJob('45 7 * * *', () =>
  eventBus.emit(constants.events.CRON_MORNING_TIME));

module.exports = {
  scheduleBedTimeJob: () => {
    if (!bedTimeJob.running) {
      bedTimeJob.start();
    }
  },
  scheduleMorningTimeJob: () => {
    if (!morningTimeJob.running) {
      morningTimeJob.start();
    }
  },
};
