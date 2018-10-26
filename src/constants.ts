const constants = {
  events: {
    BELL_RING: 'ringBell',
    PLAYER_STARTED: 'playerStarted',
    PLAYER_COMPLETED: 'playerCompleted',
    PLAYER_STOPPED: 'playerStopped', 
  },
  sources: {
    BACK_GATE_BELL: 'backGateBell', 
    FRONT_GATE_BELL: 'frontGateBell', 
    OTHER_BELL: 'otherBell',
  },
  playerOptions: {
    gain: 1,
    debug: true,
  },
  fileNames: {
    backGateBell: `./soundEffects/tone1.wav`,
    frontGateBell: `./soundEffects/tone1.wav`,
    otherBell: `./soundEffects/tone1.wav`,
  },
}

Object.freeze(constants);

export default constants;