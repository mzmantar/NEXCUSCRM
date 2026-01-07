const mongoose = require("mongoose");

const StockMovementSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },
    productId: { type: String, required: true },
    warehouseId: { type: String, required: true },
    
    type: {
      type: String,
      enum: [
        "in",           // entrée
        "out",          // sortie
        "adjustment",   // ajustement
        "transfer",     // transfert
        "return",       // retour
        "damaged",      // endommagé
        "lost"          // perdu
      ],
      required: true
    },
    
    quantity: { type: Number, required: true },
    
    reason: String,
    
    // Pour les transferts
    fromWarehouseId: String,
    toWarehouseId: String,
    
    // Références externes
    orderId: String,
    supplierOrderId: String,
    
    performedBy: String, // userId
    
    notes: String
  },
  { timestamps: true }
);

StockMovementSchema.index({ shopId: 1, productId: 1 });
StockMovementSchema.index({ warehouseId: 1, type: 1 });
StockMovementSchema.index({ createdAt: -1 });

module.exports = mongoose.model("StockMovement", StockMovementSchema);