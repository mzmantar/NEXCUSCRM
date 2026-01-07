const { emit, eventBus } = require("./eventBus");

const PAYMENT_EVENTS = {
	COMPLETED: "payment.completed",
	FAILED: "payment.failed",
	COD_COLLECTED: "payment.cod_collected",
	REFUNDED: "payment.refunded"
};

const emitPaymentCompleted = (payment, transaction) =>
	emit(PAYMENT_EVENTS.COMPLETED, { payment, transaction });

const emitPaymentFailed = (payment, transaction) =>
	emit(PAYMENT_EVENTS.FAILED, { payment, transaction });

const emitPaymentCodCollected = (payment, transaction) =>
	emit(PAYMENT_EVENTS.COD_COLLECTED, { payment, transaction });

const emitPaymentRefunded = (payment, transaction) =>
	emit(PAYMENT_EVENTS.REFUNDED, { payment, transaction });

const registerPaymentEventHandlers = ({
	onCompleted,
	onFailed,
	onCodCollected,
	onRefunded
} = {}) => {
	if (onCompleted) eventBus.on(PAYMENT_EVENTS.COMPLETED, onCompleted);
	if (onFailed) eventBus.on(PAYMENT_EVENTS.FAILED, onFailed);
	if (onCodCollected) eventBus.on(PAYMENT_EVENTS.COD_COLLECTED, onCodCollected);
	if (onRefunded) eventBus.on(PAYMENT_EVENTS.REFUNDED, onRefunded);
};

module.exports = {
	PAYMENT_EVENTS,
	emitPaymentCompleted,
	emitPaymentFailed,
	emitPaymentCodCollected,
	emitPaymentRefunded,
	registerPaymentEventHandlers
};
