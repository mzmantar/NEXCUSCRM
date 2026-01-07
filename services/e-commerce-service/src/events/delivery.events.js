const { emit, eventBus } = require("./eventBus");

const DELIVERY_EVENTS = {
	ASSIGNED: "delivery.assigned",
	SHIPPED: "delivery.shipped",
	DELIVERED: "delivery.delivered"
};

const emitDeliveryAssigned = (delivery) => emit(DELIVERY_EVENTS.ASSIGNED, { delivery });
const emitDeliveryShipped = (delivery) => emit(DELIVERY_EVENTS.SHIPPED, { delivery });
const emitDeliveryCompleted = (delivery) => emit(DELIVERY_EVENTS.DELIVERED, { delivery });

const registerDeliveryEventHandlers = ({ onAssigned, onShipped, onDelivered } = {}) => {
	if (onAssigned) eventBus.on(DELIVERY_EVENTS.ASSIGNED, onAssigned);
	if (onShipped) eventBus.on(DELIVERY_EVENTS.SHIPPED, onShipped);
	if (onDelivered) eventBus.on(DELIVERY_EVENTS.DELIVERED, onDelivered);
};

module.exports = {
	DELIVERY_EVENTS,
	emitDeliveryAssigned,
	emitDeliveryShipped,
	emitDeliveryCompleted,
	registerDeliveryEventHandlers
};
