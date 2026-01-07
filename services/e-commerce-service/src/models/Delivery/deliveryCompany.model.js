const mongoose = require("mongoose");

const DeliveryCompanySchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },

    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,

    type: {
      type: String,
      enum: ["local", "national", "international"],
      default: "local"
    },

    codSupported: { type: Boolean, default: true },

    active: { type: Boolean, default: true },
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryCompany", DeliveryCompanySchema);
