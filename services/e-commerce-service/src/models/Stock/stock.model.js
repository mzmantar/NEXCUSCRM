const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },
    productId: { type: String, required: true },
    warehouseId: { type: String, required: true },
    
    quantity: { type: Number, required: true, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    availableQuantity: { type: Number, default: 0 },
    
    minStockLevel: { type: Number, default: 0 },
    maxStockLevel: { type: Number },
    
    reorderPoint: { type: Number, default: 0 },
    reorderQuantity: { type: Number, default: 0 },
    
    lastRestockedAt: { type: Date },
    
    notes: String
  },
  { timestamps: true }
);

// 1 stock par produit/entrepôt
StockSchema.index({ shopId: 1, productId: 1, warehouseId: 1 }, { unique: true });
StockSchema.index({ shopId: 1, warehouseId: 1 });

module.exports = mongoose.model("Stock", StockSchema);