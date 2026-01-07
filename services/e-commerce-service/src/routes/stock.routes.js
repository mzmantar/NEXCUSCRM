const express = require("express");
const { body, param, validationResult } = require("express-validator");
const stockController = require("../controllers/stock.controller");

const router = express.Router();

const handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Stock
router.get("/", stockController.getStock);

router.get(
	"/:productId",
	[param("productId").notEmpty().withMessage("productId is required")],
	handleValidation,
	stockController.getStockByProduct
);

router.put(
	"/:productId/adjust",
	[
		param("productId").notEmpty().withMessage("productId is required"),
		body("warehouseId").notEmpty().withMessage("warehouseId is required"),
		body("quantity").isNumeric().withMessage("quantity must be numeric"),
		body("type")
			.optional()
			.isIn(["set", "increment", "decrement"])
			.withMessage("type must be set, increment, or decrement"),
		body("reason").optional().isString()
	],
	handleValidation,
	stockController.adjustStock
);

router.post(
	"/transfer",
	[
		body("productId").notEmpty().withMessage("productId is required"),
		body("fromWarehouseId").notEmpty().withMessage("fromWarehouseId is required"),
		body("toWarehouseId").notEmpty().withMessage("toWarehouseId is required"),
		body("quantity").isInt({ min: 1 }).withMessage("quantity must be >= 1"),
		body("reason").optional().isString()
	],
	handleValidation,
	stockController.transferStock
);

router.get("/movements", stockController.getStockMovements);

router.get("/alerts", stockController.getStockAlerts);

// Warehouses
router.get("/warehouses", stockController.getWarehouses);

router.post(
	"/warehouses",
	[
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("name").notEmpty().withMessage("name is required"),
		body("code").notEmpty().withMessage("code is required"),
		body("type").optional().isIn(["main", "secondary", "virtual"]).withMessage("invalid type"),
		body("capacity").optional().isNumeric().withMessage("capacity must be numeric"),
		body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
		body("address").optional().isObject().withMessage("address must be an object"),
		body("address.street").optional().isString(),
		body("address.city").optional().isString(),
		body("address.postalCode").optional().isString(),
		body("address.country").optional().isString(),
		body("phone").optional().isString(),
		body("email").optional().isEmail().withMessage("email must be valid"),
		body("notes").optional().isString()
	],
	handleValidation,
	stockController.createWarehouse
);

module.exports = router;
