const { emit, eventBus } = require("./eventBus");

const ORDER_EVENTS = {
	CREATED: "order.created",
	STATUS_UPDATED: "order.status_updated",
	CANCELLED: "order.cancelled",
	RETURNED: "order.returned"
};

const emitOrderCreated = (order) => emit(ORDER_EVENTS.CREATED, { order });
const emitOrderStatusUpdated = (order) => emit(ORDER_EVENTS.STATUS_UPDATED, { order });
const emitOrderCancelled = (order) => emit(ORDER_EVENTS.CANCELLED, { order });
const emitOrderReturned = (order) => emit(ORDER_EVENTS.RETURNED, { order });

const registerOrderEventHandlers = ({
	onCreated,
	onStatusUpdated,
	onCancelled,
	onReturned
} = {}) => {
	if (onCreated) eventBus.on(ORDER_EVENTS.CREATED, onCreated);
	if (onStatusUpdated) eventBus.on(ORDER_EVENTS.STATUS_UPDATED, onStatusUpdated);
	if (onCancelled) eventBus.on(ORDER_EVENTS.CANCELLED, onCancelled);
	if (onReturned) eventBus.on(ORDER_EVENTS.RETURNED, onReturned);
};

module.exports = {
	ORDER_EVENTS,
	emitOrderCreated,
	emitOrderStatusUpdated,
	emitOrderCancelled,
	emitOrderReturned,
	registerOrderEventHandlers
};
