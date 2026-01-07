const mongoose = require("mongoose");

const DeliveryCompanyZoneSchema = new mongoose.Schema(
  {
    deliveryCompanyId: { type: String, required: true },
    deliveryZoneId: { type: String, required: true },

    customFee: Number, // surcharge éventuelle
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DeliveryCompanyZone",
  DeliveryCompanyZoneSchema
);
