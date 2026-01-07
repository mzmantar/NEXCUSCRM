const Shop = require("../models/shop.model");
const User = require("../models/user.model");

exports.getMyShops = async (req, res) => {
  try {
    const userId = req.user.id;
    const shops = await Shop.find({ owner: userId });

    res.json({
      message: "Shops retrieved successfully",
      shops
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;

    const shop = await Shop.findOne({ _id: shopId, owner: userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json({
      message: "Shop retrieved successfully",
      shop
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createShop = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, slug, email, phone, country } = req.body;

    // Vérifier si le slug existe déjà
    const existingShop = await Shop.findOne({ slug });
    if (existingShop) {
      return res.status(400).json({ message: "Shop slug already exists" });
    }

    const shop = new Shop({
      name,
      slug,
      email,
      phone,
      country,
      owner: userId,
      status: "pending"
    });

    await shop.save();

    // Ajouter la boutique à la liste des boutiques de l'utilisateur
    await User.findByIdAndUpdate(
      userId,
      { $push: { shops: shop._id } }
    );

    res.status(201).json({
      message: "Shop created successfully",
      shop
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Mettre à jour une boutique
exports.updateShop = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;
    const { name, email, phone, country } = req.body;

    const shop = await Shop.findOne({ _id: shopId, owner: userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (name) shop.name = name;
    if (email) shop.email = email;
    if (phone) shop.phone = phone;
    if (country) shop.country = country;

    await shop.save();

    res.json({
      message: "Shop updated successfully",
      shop
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Supprimer une boutique
exports.deleteShop = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;

    const shop = await Shop.findOne({ _id: shopId, owner: userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    await Shop.deleteOne({ _id: shopId });

    // Retirer la boutique de la liste des boutiques de l'utilisateur
    await User.findByIdAndUpdate(
      userId,
      { $pull: { shops: shopId } }
    );

    res.json({
      message: "Shop deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Changer le statut d'une boutique (admin uniquement - à protéger avec middleware admin)
exports.updateShopStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;
    const { status } = req.body;

    if (!["pending", "active", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const shop = await Shop.findOne({ _id: shopId, owner: userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.status = status;
    await shop.save();

    res.json({
      message: "Shop status updated successfully",
      shop
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};