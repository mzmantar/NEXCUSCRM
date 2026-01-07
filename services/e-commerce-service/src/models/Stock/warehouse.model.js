const mongoose = require("mongoose");

const WarehouseSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },
    
    name: { type: String, required: true },
    code: { type: String, required: true },
    
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    },
    
    phone: String,
    email: String,
    
    type: {
      type: String,
      enum: ["main", "secondary", "virtual"],
      default: "main"
    },
    
    capacity: { type: Number },
    
    isActive: { type: Boolean, default: true },
    
    notes: String
  },
  { timestamps: true }
);

WarehouseSchema.index({ shopId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model("Warehouse", WarehouseSchema);