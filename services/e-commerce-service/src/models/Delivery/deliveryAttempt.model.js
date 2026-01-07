const mongoose = require("mongoose");

const DeliveryAttemptSchema = new mongoose.Schema(
  {
    deliveryId: { type: String, required: true },

    attemptNumber: { type: Number, required: true },

    status: {
      type: String,
      enum: ["success", "failed"]
    },

    reason: {
      type: String,
      enum: [
        "client_absent",
        "client_refused",
        "address_error",
        "phone_unreachable",
        "other"
      ]
    },

    note: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryAttempt", DeliveryAttemptSchema);
