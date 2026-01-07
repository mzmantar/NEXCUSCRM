const router = require("express").Router();
const { body, param, validationResult } = require("express-validator");

const { protect } = require("../middlewares/auth.middleware.js");
const { checkShop } = require("../middlewares/shop.middleware.js");
const ctrl = require("../controllers/segment.controller.js");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(protect, checkShop);

router.post(
  "/",
  body("name").notEmpty(),
  body("filters").isObject(),
  validate,
  ctrl.create
);

router.put(
  "/:id",
  param("id").isMongoId(),
  validate,
  ctrl.update
);

router.delete(
  "/:id",
  param("id").isMongoId(),
  validate,
  ctrl.remove
);

router.post(
  "/:id/recalculate",
  param("id").isMongoId(),
  validate,
  ctrl.recalculate
);

module.exports = router;
