const express = require("express");
const { body, param, validationResult } = require("express-validator");
const orderController = require("../controllers/order.controller");

const router = express.Router();

const handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Orders
router.post(
	"/",
	[
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("customerId").notEmpty().withMessage("customerId is required"),
		body("paymentType").isIn(["COD", "ONLINE"]).withMessage("paymentType must be COD or ONLINE"),
		body("paymentMethod")
			.optional()
			.isIn(["COD", "card", "bank_transfer", "wallet", "other"])
			.withMessage("invalid paymentMethod"),
		body("totalAmount").isFloat({ gt: 0 }).withMessage("totalAmount must be positive"),
		body("status")
			.optional()
			.isIn(["pending", "confirmed", "paid", "shipped", "delivered", "failed", "cancelled", "returned"])
			.withMessage("invalid status"),
		body("items")
			.optional()
			.isArray({ min: 1 })
			.withMessage("items must be an array"),
		body("items.*.productId").optional().notEmpty().withMessage("productId is required"),
		body("items.*.productName").optional().notEmpty().withMessage("productName is required"),
		body("items.*.productSku").optional().notEmpty().withMessage("productSku is required"),
		body("items.*.quantity").optional().isInt({ min: 1 }).withMessage("quantity must be >= 1"),
		body("items.*.unitPrice").optional().isFloat({ gt: 0 }).withMessage("unitPrice must be positive"),
		body("items.*.totalPrice").optional().isFloat({ gt: 0 }).withMessage("totalPrice must be positive"),
		body("notes").optional().isString()
	],
	handleValidation,
	orderController.createOrder
);

	router.get("/", orderController.getOrders);

router.get(
	"/:id",
	[param("id").isMongoId().withMessage("invalid order id")],
	handleValidation,
	orderController.getOrderById
);

router.put(
	"/:id",
	[
		param("id").isMongoId().withMessage("invalid order id"),
		body("paymentType").optional().isIn(["COD", "ONLINE"]),
		body("paymentMethod").optional().isIn(["COD", "card", "bank_transfer", "wallet", "other"]),
		body("totalAmount").optional().isFloat({ gt: 0 }),
		body("status")
			.optional()
			.isIn(["pending", "confirmed", "paid", "shipped", "delivered", "failed", "cancelled", "returned"]),
		body("notes").optional().isString()
	],
	handleValidation,
	orderController.updateOrder
);

router.delete(
	"/:id",
	[param("id").isMongoId().withMessage("invalid order id")],
	handleValidation,
	orderController.deleteOrder
);

router.patch(
	"/:id/status",
	[
		param("id").isMongoId().withMessage("invalid order id"),
		body("status")
			.isIn(["pending", "confirmed", "paid", "shipped", "delivered", "failed", "cancelled", "returned"])
			.withMessage("invalid status")
	],
	handleValidation,
	orderController.updateOrderStatus
);

router.post(
	"/:id/cancel",
	[param("id").isMongoId().withMessage("invalid order id")],
	handleValidation,
	orderController.cancelOrder
);

router.post(
	"/:id/return",
	[param("id").isMongoId().withMessage("invalid order id")],
	handleValidation,
	orderController.returnOrder
);

module.exports = router;
