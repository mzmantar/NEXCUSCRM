const { emit, eventBus } = require("./eventBus");

const SUPPLIER_EVENTS = {
	CREATED: "supplier.created",
	UPDATED: "supplier.updated"
};

const emitSupplierCreated = (supplier) => emit(SUPPLIER_EVENTS.CREATED, { supplier });
const emitSupplierUpdated = (supplier) => emit(SUPPLIER_EVENTS.UPDATED, { supplier });

const registerSupplierEventHandlers = ({ onCreated, onUpdated } = {}) => {
	if (onCreated) eventBus.on(SUPPLIER_EVENTS.CREATED, onCreated);
	if (onUpdated) eventBus.on(SUPPLIER_EVENTS.UPDATED, onUpdated);
};

module.exports = {
	SUPPLIER_EVENTS,
	emitSupplierCreated,
	emitSupplierUpdated,
	registerSupplierEventHandlers
};
