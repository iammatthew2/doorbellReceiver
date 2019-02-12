const constants = {
  events: {
    BELL_RING: 'ringBell',
    PLAYER_STARTED: 'playerStarted',
    PLAYER_COMPLETED: 'playerCompleted',
    PLAYER_STOPPED: 'playerStopped',
    CRON_BED_TIME: 'cronBedTime',
    CRON_MORNING_TIME: 'cronMorningTime',
  },
  requests: {
    BACK_GATE_BELL: 'backGateBell', 
    FRONT_GATE_BELL: 'frontGateBell', 
    OTHER_BELL: 'otherBell',
    MUTE_INTERVAL: 'muteInterval',
    TURN_OFF: 'turnOff',
    TURN_ON: 'turnOn',
    HEALTH_CHECK_PING: 'healthCheckPing',
  },
  playerOptions: {
    gain: 1,
    debug: true,
    device: 'default',
  },
  fileNames: {
    backGateBell: `./soundEffects/backBell.wav`,
    frontGateBell: `./soundEffects/frontBell.wav`,
    otherBell: `./soundEffects/final.wav`,
  },
  serverStates: {
    REQUESTS_ALLOWED: 'requestsAllowed',
    REQUESTS_BLOCKED: 'requestsBlocked',
  },
  logTypes: {
    INFO: 'info',
    ERROR: 'error'
  },
}

Object.freeze(constants);

export default constants;