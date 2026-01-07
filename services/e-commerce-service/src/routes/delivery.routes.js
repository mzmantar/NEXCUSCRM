const express = require("express");
const { body, param, validationResult } = require("express-validator");
const deliveryController = require("../controllers/delivery.controller");

const router = express.Router();

const handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Deliveries
router.post(
	"/",
	[
		body("orderId").notEmpty().withMessage("orderId is required"),
		body("deliveryCompanyId").notEmpty().withMessage("deliveryCompanyId is required"),
		body("deliveryZoneId").notEmpty().withMessage("deliveryZoneId is required"),
		body("deliveryFee").isFloat({ gt: 0 }).withMessage("deliveryFee must be positive"),
		body("status")
			.optional()
			.isIn(["pending", "assigned", "in_transit", "out_for_delivery", "delivered", "failed", "returned"])
			.withMessage("invalid status"),
		body("trackingNumber").optional().isString(),
		body("notes").optional().isString()
	],
	handleValidation,
	deliveryController.createDelivery
);

router.get("/", deliveryController.getAllDeliveries);

router.get(
	"/:id",
	[param("id").isMongoId().withMessage("invalid delivery id")],
	handleValidation,
	deliveryController.getDeliveryById
);

router.patch(
	"/:id/status",
	[
		param("id").isMongoId().withMessage("invalid delivery id"),
		body("status")
			.isIn(["pending", "assigned", "in_transit", "out_for_delivery", "delivered", "failed", "returned"])
			.withMessage("invalid status")
	],
	handleValidation,
	deliveryController.updateDeliveryStatus
);

// Delivery agents
router.post(
	"/agent",
	[
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("deliveryCompanyId").notEmpty().withMessage("deliveryCompanyId is required"),
		body("name").notEmpty().withMessage("name is required"),
		body("phone").notEmpty().withMessage("phone is required"),
		body("status").optional().isIn(["active", "inactive"]).withMessage("invalid status"),
		body("zones").optional().isArray().withMessage("zones must be an array"),
		body("notes").optional().isString()
	],
	handleValidation,
	deliveryController.createDeliveryAgent
);

router.get("/agents", deliveryController.getAllDeliveryAgents);

// Delivery attempts
router.post(
	"/attempt",
	[
		body("deliveryId").notEmpty().withMessage("deliveryId is required"),
		body("attemptNumber").isInt({ min: 1 }).withMessage("attemptNumber must be >= 1"),
		body("status").isIn(["success", "failed"]).withMessage("invalid status"),
		body("reason")
			.optional()
			.isIn(["client_absent", "client_refused", "address_error", "phone_unreachable", "other"])
			.withMessage("invalid reason"),
		body("note").optional().isString()
	],
	handleValidation,
	deliveryController.createDeliveryAttempt
);

router.get(
	"/attempts/:deliveryId",
	[param("deliveryId").isMongoId().withMessage("invalid delivery id")],
	handleValidation,
	deliveryController.getDeliveryAttemptsByDeliveryId
);

// Delivery companies
router.post(
	"/company",
	[
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("name").notEmpty().withMessage("name is required"),
		body("type").optional().isIn(["local", "national", "international"]).withMessage("invalid type"),
		body("codSupported").optional().isBoolean().withMessage("codSupported must be boolean"),
		body("active").optional().isBoolean().withMessage("active must be boolean"),
		body("phone").optional().isString(),
		body("email").optional().isEmail().withMessage("email must be valid"),
		body("address").optional().isString(),
		body("notes").optional().isString()
	],
	handleValidation,
	deliveryController.createDeliveryCompany
);

router.get("/companies", deliveryController.getAllDeliveryCompanies);

// Delivery company zones (link)
router.post(
	"/company/zone",
	[
		body("deliveryCompanyId").notEmpty().withMessage("deliveryCompanyId is required"),
		body("deliveryZoneId").notEmpty().withMessage("deliveryZoneId is required"),
		body("customFee").optional().isFloat({ gt: 0 }).withMessage("customFee must be positive"),
		body("active").optional().isBoolean().withMessage("active must be boolean")
	],
	handleValidation,
	deliveryController.createDeliveryCompanyZone
);

router.get(
	"/company/zones/:companyId",
	[param("companyId").isMongoId().withMessage("invalid company id")],
	handleValidation,
	deliveryController.getDeliveryCompanyZones
);

// Delivery zones
router.post(
	"/zone",
	[
		body("shopId").notEmpty().withMessage("shopId is required"),
		body("name").notEmpty().withMessage("name is required"),
		body("city").notEmpty().withMessage("city is required"),
		body("postalCodes").optional().isArray().withMessage("postalCodes must be an array"),
		body("deliveryFee").isFloat({ gt: 0 }).withMessage("deliveryFee must be positive"),
		body("estimatedDeliveryTime").optional().isString(),
		body("codSupported").optional().isBoolean(),
		body("active").optional().isBoolean()
	],
	handleValidation,
	deliveryController.createDeliveryZone
);

router.get("/zones", deliveryController.getAllDeliveryZones);

module.exports = router;
