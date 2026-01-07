const Review = require("../models/review.model");
const genId = require("../utils/generateId");

exports.listByProduct = async (req, res) => {
  res.json(
    await Review.find({
      productId: req.params.productId,
      status: "approved"
    })
  );
};

exports.create = async (req, res) => {
  res.json(
    await Review.create({
      reviewId: genId(),
      shopId: req.headers["x-shop-id"],
      productId: req.params.productId,
      ...req.body
    })
  );
};
