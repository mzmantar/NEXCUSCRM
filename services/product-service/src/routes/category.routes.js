const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const ctrl = require("../controllers/category.controller");

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
  validate,
  ctrl.create
);

module.exports = router;
