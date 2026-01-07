const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    shopId: { type: String, required: true },
    
    amount: { type: Number, required: true },
    
    paymentMethod: {
      type: String,
      enum: ["COD", "card", "bank_transfer", "wallet", "other"],
      required: true
    },
    
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded", "cancelled"],
      default: "pending"
    },
    
    currency: { type: String, default: "TND" },
    
    paidAt: { type: Date },
    refundedAt: { type: Date },
    
    notes: String
  },
  { timestamps: true }
);

PaymentSchema.index({ shopId: 1, status: 1 });

module.exports = mongoose.model("Payment", PaymentSchema);