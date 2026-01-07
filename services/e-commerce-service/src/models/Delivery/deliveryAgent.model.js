const mongoose = require("mongoose");

const DeliveryAgentSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },

    deliveryCompanyId: { type: String, required: true },

    name: { type: String, required: true },
    phone: { type: String, required: true },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    zones: [String], // ids des zones
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryAgent", DeliveryAgentSchema);
