const Soundplayer = require('sound-player');
import eventBus  from'./eventBus';
import constants from './constants';
import logger from './logger';

const playerInstance = new Soundplayer({});

playerInstance.on('stop', () => eventBus.emit(constants.events.PLAYER_STOPPED));
playerInstance.on('complete', () => eventBus.emit(constants.events.PLAYER_COMPLETED));
playerInstance.on('play', () => logger.info('playing sound'));

const stopPlaying = () => {
  if (playerInstance && playerInstance.stop) {
    playerInstance.stop();
  }
};  



// \\\\\





const startPlaying = () => {
  stopPlaying(); 

  playerInstance.play(constants.playerOptions);
  // returning a promise here since I expect to expand this a bit
  return new Promise((resolve, reject) => {
    playerInstance.on('complete', resolve);
    playerInstance.on('stop', () => reject('player stopped normally'));
  });
};

export default startPlaying;