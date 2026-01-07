const router = require("express").Router();
const { body, param, validationResult } = require("express-validator");
const ctrl = require("../controllers/product.controller");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", ctrl.list);

router.post(
  "/",
  body("name").notEmpty(),
  body("slug").notEmpty(),
  body("sku").notEmpty(),
  body("price").isNumeric(),
  body("categories").isArray({ min: 1 }),
  body("seo").optional().isObject(),
  body("seo.title").optional().isString(),
  body("seo.description").optional().isString(),
  body("seo.keywords").optional().isArray(),
  body("seo.keywords.*").optional().isString(),
  body("seo.ogImage").optional().isString(),
  validate,
  ctrl.create
);

router.put(
  "/:id",
  param("id").notEmpty(),
  body("seo").optional().isObject(),
  body("seo.title").optional().isString(),
  body("seo.description").optional().isString(),
  body("seo.keywords").optional().isArray(),
  body("seo.keywords.*").optional().isString(),
  body("seo.ogImage").optional().isString(),
  validate,
  ctrl.update
);

router.delete(
  "/:id",
  param("id").notEmpty(),
  validate,
  ctrl.remove
);

router.get(
  "/:id/images",
  param("id").notEmpty(),
  validate,
  ctrl.listImages
);

router.post(
  "/:id/images",
  param("id").notEmpty(),
  body("url").isURL(),
  body("altText").optional().isString(),
  body("isPrimary").optional().isBoolean(),
  body("position").optional().isInt({ min: 0 }),
  validate,
  ctrl.addImage
);

router.put(
  "/:id/images/:imageId",
  param("id").notEmpty(),
  param("imageId").notEmpty(),
  body("url").optional().isURL(),
  body("altText").optional().isString(),
  body("isPrimary").optional().isBoolean(),
  body("position").optional().isInt({ min: 0 }),
  validate,
  ctrl.updateImage
);

router.delete(
  "/:id/images/:imageId",
  param("id").notEmpty(),
  param("imageId").notEmpty(),
  validate,
  ctrl.removeImage
);

router.get(
  "/:id/promotions",
  param("id").notEmpty(),
  validate,
  ctrl.listPromotions
);

router.post(
  "/:id/promotions",
  param("id").notEmpty(),
  body("title").notEmpty(),
  body("description").optional().isString(),
  body("discountType").optional().isIn(["percentage", "amount"]),
  body("value").isNumeric(),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("isActive").optional().isBoolean(),
  validate,
  ctrl.addPromotion
);

router.put(
  "/:id/promotions/:promotionId",
  param("id").notEmpty(),
  param("promotionId").notEmpty(),
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("discountType").optional().isIn(["percentage", "amount"]),
  body("value").optional().isNumeric(),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("isActive").optional().isBoolean(),
  validate,
  ctrl.updatePromotion
);

router.delete(
  "/:id/promotions/:promotionId",
  param("id").notEmpty(),
  param("promotionId").notEmpty(),
  validate,
  ctrl.removePromotion
);

module.exports = router;
