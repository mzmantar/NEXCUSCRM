const EventEmitter = require("events");

class EventBus extends EventEmitter {}

const eventBus = new EventBus();
// Allow multiple domain listeners without warning
eventBus.setMaxListeners(50);

const emit = (eventName, payload) => eventBus.emit(eventName, payload);

module.exports = { eventBus, emit };
