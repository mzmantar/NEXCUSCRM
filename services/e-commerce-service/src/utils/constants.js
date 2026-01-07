
const ORDER_STATUS = {
	PENDING: "pending",
	CONFIRMED: "confirmed",
	PAID: "paid",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
	FAILED: "failed",
	CANCELLED: "cancelled",
	RETURNED: "returned"
};

const PAYMENT_STATUS = {
	PENDING: "pending",
	PROCESSING: "processing",
	COMPLETED: "completed",
	FAILED: "failed",
	REFUNDED: "refunded",
	CANCELLED: "cancelled"
};

const DELIVERY_STATUS = {
	PENDING: "pending",
	ASSIGNED: "assigned",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
	FAILED: "failed",
	CANCELLED: "cancelled"
};

const PAYMENT_METHODS = {
	COD: "COD",
	CARD: "card",
	BANK_TRANSFER: "bank_transfer",
	WALLET: "wallet",
	OTHER: "other"
};

const PAYMENT_TYPES = {
	COD: "COD",
	ONLINE: "ONLINE"
};

module.exports = {
	ORDER_STATUS,
	PAYMENT_STATUS,
	DELIVERY_STATUS,
	PAYMENT_METHODS,
	PAYMENT_TYPES
};
