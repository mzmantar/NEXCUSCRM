const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true, unique: true, index: true },
    shopId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true },
    parentId: { type: String, default: null }, // Category 1 -> N Category

    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

categorySchema.index({ shopId: 1, name: 1 });

module.exports = mongoose.model("Category", categorySchema);
