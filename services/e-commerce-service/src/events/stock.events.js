const { emit, eventBus } = require("./eventBus");

const STOCK_EVENTS = {
	RESERVED: "stock.reserved",
	ADJUSTED: "stock.adjusted",
	REPLENISHED: "stock.replenished"
};

const emitStockReserved = (stockMove) => emit(STOCK_EVENTS.RESERVED, { stockMove });
const emitStockAdjusted = (stockMove) => emit(STOCK_EVENTS.ADJUSTED, { stockMove });
const emitStockReplenished = (stockMove) => emit(STOCK_EVENTS.REPLENISHED, { stockMove });

const registerStockEventHandlers = ({ onReserved, onAdjusted, onReplenished } = {}) => {
	if (onReserved) eventBus.on(STOCK_EVENTS.RESERVED, onReserved);
	if (onAdjusted) eventBus.on(STOCK_EVENTS.ADJUSTED, onAdjusted);
	if (onReplenished) eventBus.on(STOCK_EVENTS.REPLENISHED, onReplenished);
};

module.exports = {
	STOCK_EVENTS,
	emitStockReserved,
	emitStockAdjusted,
	emitStockReplenished,
	registerStockEventHandlers
};
