const Product = require("../models/product.model");
const genId = require("../utils/generateId");

exports.list = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  res.json(await Product.find({ shopId }));
};

exports.create = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  res.json(
    await Product.create({
      productId: genId(),
      shopId,
      ...req.body
    })
  );
};

exports.update = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  res.json(
    await Product.findOneAndUpdate(
      { productId: req.params.id, shopId },
      req.body,
      { new: true }
    )
  );
};

exports.remove = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  await Product.findOneAndUpdate(
    { productId: req.params.id, shopId },
    { deletedAt: new Date() }
  );
  res.sendStatus(204);
};

exports.listImages = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const product = await Product.findOne(
    { productId: req.params.id, shopId },
    { images: 1, _id: 0 }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product.images);
};

exports.addImage = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const image = {
    imageId: genId(),
    url: req.body.url,
    altText: req.body.altText || "",
    isPrimary: req.body.isPrimary ?? false,
    position: req.body.position ?? 0
  };

  const product = await Product.findOneAndUpdate(
    { productId: req.params.id, shopId },
    { $push: { images: image } },
    { new: true, projection: { images: 1 } }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const createdImage = product.images.find(img => img.imageId === image.imageId);
  res.status(201).json(createdImage || image);
};

exports.updateImage = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const updates = {};

  if (Object.prototype.hasOwnProperty.call(req.body, "url")) {
    updates["images.$[img].url"] = req.body.url;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "altText")) {
    updates["images.$[img].altText"] = req.body.altText;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "isPrimary")) {
    updates["images.$[img].isPrimary"] = req.body.isPrimary;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "position")) {
    updates["images.$[img].position"] = req.body.position;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const product = await Product.findOneAndUpdate(
    { productId: req.params.id, shopId },
    { $set: updates },
    {
      new: true,
      projection: { images: 1 },
      arrayFilters: [{ "img.imageId": req.params.imageId }]
    }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const image = product.images.find(img => img.imageId === req.params.imageId);
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  res.json(image);
};

exports.removeImage = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const product = await Product.findOneAndUpdate(
    { productId: req.params.id, shopId },
    { $pull: { images: { imageId: req.params.imageId } } },
    { new: true, projection: { images: 1 } }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const image = product.images.find(img => img.imageId === req.params.imageId);
  if (image) {
    // $pull failed to remove for some reason
    return res.status(500).json({ message: "Unable to remove image" });
  }

  res.sendStatus(204);
};

exports.listPromotions = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const product = await Product.findOne(
    { productId: req.params.id, shopId },
    { promotions: 1, _id: 0 }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product.promotions);
};

exports.addPromotion = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const promotion = {
    promotionId: genId(),
    title: req.body.title,
    description: req.body.description || "",
    discountType: req.body.discountType || "percentage",
    value: req.body.value,
    startDate: req.body.startDate || null,
    endDate: req.body.endDate || null,
    isActive: req.body.isActive ?? true
  };

  const product = await Product.findOneAndUpdate(
    { productId: req.params.id, shopId },
    { $push: { promotions: promotion } },
    { new: true, projection: { promotions: 1 } }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const createdPromotion = product.promotions.find(
    promo => promo.promotionId === promotion.promotionId
  );
  res.status(201).json(createdPromotion || promotion);
};

exports.updatePromotion = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const updates = {};

  if (Object.prototype.hasOwnProperty.call(req.body, "title")) {
    updates["promotions.$[promo].title"] = req.body.title;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
    updates["promotions.$[promo].description"] = req.body.description;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "discountType")) {
    updates["promotions.$[promo].discountType"] = req.body.discountType;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "value")) {
    updates["promotions.$[promo].value"] = req.body.value;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "startDate")) {
    updates["promotions.$[promo].startDate"] = req.body.startDate;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "endDate")) {
    updates["promotions.$[promo].endDate"] = req.body.endDate;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "isActive")) {
    updates["promotions.$[promo].isActive"] = req.body.isActive;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const product = await Product.findOneAndUpdate(
    { productId: req.params.id, shopId },
    { $set: updates },
    {
      new: true,
      projection: { promotions: 1 },
      arrayFilters: [{ "promo.promotionId": req.params.promotionId }]
    }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const promotion = product.promotions.find(
    promo => promo.promotionId === req.params.promotionId
  );

  if (!promotion) {
    return res.status(404).json({ message: "Promotion not found" });
  }

  res.json(promotion);
};

exports.removePromotion = async (req, res) => {
  const shopId = req.headers["x-shop-id"];
  const product = await Product.findOneAndUpdate(
    { productId: req.params.id, shopId },
    { $pull: { promotions: { promotionId: req.params.promotionId } } },
    { new: true, projection: { promotions: 1 } }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const promotion = product.promotions.find(
    promo => promo.promotionId === req.params.promotionId
  );

  if (promotion) {
    return res.status(500).json({ message: "Unable to remove promotion" });
  }

  res.sendStatus(204);
};