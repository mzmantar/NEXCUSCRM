const express = require("express");
const { body, param, validationResult } = require("express-validator");
const supplierController = require("../controllers/supplier.controller");

const router = express.Router();

const handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Suppliers
router.post(
	"/",
	[
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("name").notEmpty().withMessage("name is required"),
		body("code").notEmpty().withMessage("code is required"),
		body("email").optional().isEmail().withMessage("invalid email"),
		body("phone").optional().isString(),
		body("contactPerson").optional().isString(),
		body("taxId").optional().isString(),
		body("paymentTerms").optional().isString(),
		body("rating").optional().isFloat({ min: 1, max: 5 }).withMessage("rating must be 1-5"),
		body("categories").optional().isArray().withMessage("categories must be an array"),
		body("isActive").optional().isBoolean(),
		body("notes").optional().isString()
	],
	handleValidation,
	supplierController.createSupplier
);

router.get("/", supplierController.getSuppliers);

router.get(
	"/:id",
	[param("id").isMongoId().withMessage("invalid supplier id")],
	handleValidation,
	supplierController.getSupplierById
);

router.put(
	"/:id",
	[
		param("id").isMongoId().withMessage("invalid supplier id"),
		body("name").optional().notEmpty(),
		body("code").optional().notEmpty(),
		body("email").optional().isEmail(),
		body("phone").optional().isString(),
		body("contactPerson").optional().isString(),
		body("taxId").optional().isString(),
		body("paymentTerms").optional().isString(),
		body("rating").optional().isFloat({ min: 1, max: 5 }),
		body("categories").optional().isArray(),
		body("isActive").optional().isBoolean(),
		body("notes").optional().isString()
	],
	handleValidation,
	supplierController.updateSupplier
);

router.delete(
	"/:id",
	[param("id").isMongoId().withMessage("invalid supplier id")],
	handleValidation,
	supplierController.deleteSupplier
);

// Supplier orders
router.post(
	"/orders",
	[
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("supplierId").notEmpty().withMessage("supplierId is required"),
		body("orderNumber").notEmpty().withMessage("orderNumber is required"),
		body("warehouseId").notEmpty().withMessage("warehouseId is required"),
		body("items").isArray({ min: 1 }).withMessage("items must be an array"),
		body("items.*.productId").notEmpty().withMessage("productId is required"),
		body("items.*.quantity").isInt({ min: 1 }).withMessage("quantity must be >= 1"),
		body("items.*.unitPrice").isFloat({ gt: 0 }).withMessage("unitPrice must be positive"),
		body("items.*.totalPrice").isFloat({ gt: 0 }).withMessage("totalPrice must be positive"),
		body("totalAmount").isFloat({ gt: 0 }).withMessage("totalAmount must be positive"),
		body("status")
			.optional()
			.isIn(["draft", "pending", "confirmed", "partially_received", "received", "cancelled"])
			.withMessage("invalid status"),
		body("orderDate").optional().isISO8601().toDate(),
		body("expectedDeliveryDate").optional().isISO8601().toDate(),
		body("deliveredDate").optional().isISO8601().toDate(),
		body("notes").optional().isString()
	],
	handleValidation,
	supplierController.createSupplierOrder
);

router.get("/orders", supplierController.getSupplierOrders);

router.get(
	"/orders/:id",
	[param("id").isMongoId().withMessage("invalid supplier order id")],
	handleValidation,
	supplierController.getSupplierOrderById
);

router.put(
	"/orders/:id",
	[
		param("id").isMongoId().withMessage("invalid supplier order id"),
		body("items").optional().isArray({ min: 1 }),
		body("items.*.productId").optional().notEmpty(),
		body("items.*.quantity").optional().isInt({ min: 1 }),
		body("items.*.unitPrice").optional().isFloat({ gt: 0 }),
		body("items.*.totalPrice").optional().isFloat({ gt: 0 }),
		body("totalAmount").optional().isFloat({ gt: 0 }),
		body("status")
			.optional()
			.isIn(["draft", "pending", "confirmed", "partially_received", "received", "cancelled"]),
		body("expectedDeliveryDate").optional().isISO8601().toDate(),
		body("deliveredDate").optional().isISO8601().toDate(),
		body("notes").optional().isString()
	],
	handleValidation,
	supplierController.updateSupplierOrder
);

router.delete(
	"/orders/:id",
	[param("id").isMongoId().withMessage("invalid supplier order id")],
	handleValidation,
	supplierController.deleteSupplierOrder
);

module.exports = router;
