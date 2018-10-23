const EventEmitter = require('events');

/**
 * Use the native eventEmitter to provide an eventBus
 */
class Emitter extends EventEmitter {};
const eventBus = new Emitter();

export default eventBus;
