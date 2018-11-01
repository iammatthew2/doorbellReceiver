const Soundplayer = require('sound-player');
const assert = require('assert');
import eventBus from './eventBus';
import constants from './constants';
import track from './tracker';

const playerInstance = new Soundplayer({});

playerInstance.on('stop', () => eventBus.emit(constants.events.PLAYER_STOPPED));
playerInstance.on('complete', () =>
  eventBus.emit(constants.events.PLAYER_COMPLETED)
);
playerInstance.on('play', () => track(constants.logTypes.INFO, 'playing sound'));

const stopPlaying = () => {
  if (playerInstance && playerInstance.stop) {
    playerInstance.stop();
  }
};

const startPlaying = (event: string) => {
  stopPlaying();
  assert(constants.fileNames[event], `${event} must be in constants.fileNames`);

  const options = Object.assign(
    { filename: constants.fileNames[event] },
    constants.playerOptions
  );

  playerInstance.play(options);
  // returning a promise here since I expect to expand this a bit
  return new Promise((resolve, reject) => {
    playerInstance.on('complete', resolve);
    playerInstance.on('stop', resolve);
  });
};

export default startPlaying;
