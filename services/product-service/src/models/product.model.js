const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageId: { type: String, required: true },
    url: { type: String, required: true },
    altText: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
    position: { type: Number, default: 0 }
  },
  { _id: false }
);

const promotionSchema = new mongoose.Schema(
  {
    promotionId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    discountType: {
      type: String,
      enum: ["percentage", "amount"],
      default: "percentage"
    },
    value: { type: Number, required: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, default: "" }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    shopId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, index: true },
    sku: { type: String, required: true, index: true },

    description: String,
    price: { type: Number, required: true },

    // Product M -> M Category
    categories: {
      type: [String], // categoryId[]
      required: true,
      index: true
    },

    // Product M -> M Product (related products)
    relatedProducts: [String], // productId[]

    images: {
      type: [imageSchema],
      default: []
    },

    promotions: {
      type: [promotionSchema],
      default: []
    },

    seo: {
      type: seoSchema,
      default: () => ({})
    },

    stats: {
      totalSales: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      reviewsCount: { type: Number, default: 0 }
    },

    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active"
    },

    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

productSchema.index({ shopId: 1, slug: 1 }, { unique: true });
productSchema.index({ shopId: 1, sku: 1 });

module.exports = mongoose.model("Product", productSchema);
