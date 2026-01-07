const Category = require("../models/category.model");
const genId = require("../utils/generateId");

exports.list = async (req, res) => {
  res.json(await Category.find({ shopId: req.headers["x-shop-id"] }));
};

exports.create = async (req, res) => {
  res.json(
    await Category.create({
      categoryId: genId(),
      shopId: req.headers["x-shop-id"],
      ...req.body
    })
  );
};
