const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { protect } = require("../middlewares/auth.middleware.js");
const { checkShop } = require("../middlewares/shop.middleware.js");
const ctrl = require("../controllers/history.controller.js");

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
  body("contactId").isMongoId(),
  body("type").notEmpty(),
  validate,
  ctrl.add
);

module.exports = router;
