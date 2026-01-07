const router = require("express").Router();
const { body, param, validationResult } = require("express-validator");
const ctrl = require("../controllers/review.controller");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/:productId", ctrl.listByProduct);

router.post(
  "/:productId",
  param("productId").notEmpty(),
  body("rating").isInt({ min: 1, max: 5 }),
  body("clientId").notEmpty(),
  validate,
  ctrl.create
);

module.exports = router;
