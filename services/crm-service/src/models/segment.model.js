const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema(
  {
    segmentId: {
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

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: String,

    type: {
      type: String,
      enum: ["manual", "dynamic", "system"],
      default: "dynamic",
      index: true
    },

    filters: [
      {
        field: { type: String, required: true },
        operator: { type: String, required: true },
        value: mongoose.Schema.Types.Mixed
      }
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    contactCount: {
      type: Number,
      default: 0
    },

    lastCalculatedAt: Date,
    calculatedBy: String,

    version: {
      type: Number,
      default: 1
    },

    createdBy: String,
    updatedBy: String,

    deletedAt: {
      type: Date,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

segmentSchema.index({ shopId: 1, isActive: 1 });
segmentSchema.index({ shopId: 1, type: 1 });

module.exports = mongoose.model("Segment", segmentSchema);
