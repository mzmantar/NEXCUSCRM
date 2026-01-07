const express = require("express");
const { body, param, validationResult } = require("express-validator");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

const handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Payments
router.post(
	"/",
	[
		body("orderId").notEmpty().withMessage("orderId is required"),
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("amount").isFloat({ gt: 0 }).withMessage("amount must be positive"),
		body("paymentMethod")
			.isIn(["COD", "card", "bank_transfer", "wallet", "other"])
			.withMessage("invalid paymentMethod"),
		body("status")
			.optional()
			.isIn(["pending", "processing", "completed", "failed", "refunded", "cancelled"])
			.withMessage("invalid status"),
		body("currency").optional().isString(),
		body("notes").optional().isString()
	],
	handleValidation,
	paymentController.createPayment
);

router.get("/", paymentController.getPayments);

router.get(
	"/:id",
	[param("id").isMongoId().withMessage("invalid payment id")],
	handleValidation,
	paymentController.getPaymentById
);

router.post(
	"/:id/process",
	[
		param("id").isMongoId().withMessage("invalid payment id"),
		body("amount").optional().isFloat({ gt: 0 }).withMessage("amount must be positive"),
		body("paymentMethod")
			.optional()
			.isIn(["COD", "card", "bank_transfer", "wallet", "other"])
			.withMessage("invalid paymentMethod"),
		body("status")
			.optional()
			.isIn(["pending", "processing", "completed", "failed", "refunded", "cancelled"])
			.withMessage("invalid status")
	],
	handleValidation,
	paymentController.processPayment
);

	router.post(
		"/:id/collect-cod",
		[
			param("id").isMongoId().withMessage("invalid payment id"),
			body("amount").optional().isFloat({ gt: 0 }).withMessage("amount must be positive"),
			body("collectedAt").optional().isISO8601().withMessage("collectedAt must be a valid date")
		],
		handleValidation,
		paymentController.collectCodPayment
	);

router.post(
	"/:id/refund",
	[
		param("id").isMongoId().withMessage("invalid payment id"),
		body("amount").isFloat({ gt: 0 }).withMessage("amount must be positive"),
		body("reason").optional().isString()
	],
	handleValidation,
	paymentController.refundPayment
);

router.get(
	"/:id/transactions",
	[param("id").isMongoId().withMessage("invalid payment id")],
	handleValidation,
	paymentController.getPaymentTransactionsByPaymentId
);

module.exports = router;
