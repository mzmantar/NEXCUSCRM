const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },

    deliveryCompanyId: { type: String, required: true }, // société
    deliveryAgentId: { type: String }, // livreur
    deliveryZoneId: { type: String, required: true }, // zone

    trackingNumber: String,

    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed",
        "returned"
      ],
      default: "pending"
    },

    attempts: { type: Number, default: 0 },

    deliveryFee: { type: Number, required: true },

    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
