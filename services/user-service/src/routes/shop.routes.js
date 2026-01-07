const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  getMyShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  updateShopStatus
} = require("../controllers/shop.controller");

router.get("/", protect, getMyShops);
router.get("/:shopId", protect, getShopById);
router.post("/", protect, createShop);
router.put("/:shopId", protect, updateShop);
router.delete("/:shopId", protect, deleteShop);
router.patch("/:shopId/status", protect, updateShopStatus);

module.exports = router;
