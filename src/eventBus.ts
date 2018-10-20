const EventEmitter = require('events');

/**
 * Use the native eventEmitter to provide an eventBus
 */
class Emitter extends EventEmitter {}
export const eventBus = new Emitter();
