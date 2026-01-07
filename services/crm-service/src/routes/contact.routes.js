const router = require("express").Router();
const { body, param, validationResult } = require("express-validator");
const { protect } = require("../middlewares/auth.middleware.js");
const { checkShop } = require("../middlewares/shop.middleware.js");
const ctrl = require("../controllers/contact.controller.js");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(protect, checkShop);

router.get("/", ctrl.list);

router.post(
"/",
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").isEmail(),
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

module.exports = router;