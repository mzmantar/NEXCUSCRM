const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPES } = require("../../utils/constants");

const OrderSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },
    customerId: { type: String, required: true },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    },

    paymentType: {
      type: String,
      enum: Object.values(PAYMENT_TYPES),
      required: true
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },

    paymentId: { type: String },

    totalAmount: { type: Number, required: true },
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
