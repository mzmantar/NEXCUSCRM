const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    historyId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    shopId: {
      type: String,
      required: true,
      index: true
    },

    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["email", "call", "ticket", "order", "note", "update"],
      required: true,
      index: true
    },

    title: String,
    message: String,

    meta: {
      type: Object
    },

    sourceService: {
      type: String,
      required: true
    },

    createdBy: String
  },
  { timestamps: true }
);

historySchema.index({ contact: 1, createdAt: -1 });

module.exports = mongoose.model("History", historySchema);
