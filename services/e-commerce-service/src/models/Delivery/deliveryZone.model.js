const mongoose = require("mongoose");

const DeliveryZoneSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },

    name: { type: String, required: true }, 
    city: { type: String, required: true },

    postalCodes: [String],

    deliveryFee: { type: Number, required: true },

    estimatedDeliveryTime: String, // ex: 24-48h

    codSupported: { type: Boolean, default: true },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryZone", DeliveryZoneSchema);
