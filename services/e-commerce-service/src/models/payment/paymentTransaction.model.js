const mongoose = require("mongoose");

const PaymentTransactionSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    
    transactionId: { type: String, unique: true },
    
    type: {
      type: String,
      enum: ["charge", "refund", "reversal"],
      required: true
    },
    
    amount: { type: Number, required: true },
    
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },
    
    gateway: { type: String }, // stripe, paypal, etc.
    gatewayResponse: { type: mongoose.Schema.Types.Mixed },
    
    errorMessage: String,
    
    processedAt: { type: Date }
  },
  { timestamps: true }
);

PaymentTransactionSchema.index({ paymentId: 1 });

module.exports = mongoose.model("PaymentTransaction", PaymentTransactionSchema);