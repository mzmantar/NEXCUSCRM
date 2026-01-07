const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, required: true, unique: true, index: true },
    shopId: { type: String, required: true, index: true },

    // Product 1 -> N Review
    productId: { type: String, required: true, index: true },

    // External services (IDs only)
    clientId: { type: String, required: true }, // CRM-SERVICE
    orderId: { type: String }, // ORDER-SERVICE

    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// 1 review max par client / produit
reviewSchema.index({ productId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
