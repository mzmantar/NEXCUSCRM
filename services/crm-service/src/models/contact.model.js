const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    contactId: {
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

    type: {
      type: String,
      enum: ["client", "prospect", "fournisseur"],
      default: "prospect",
      index: true
    },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    phone: String,
    company: String,
    position: String,

    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    },

    tags: {
      type: [String],
      default: [],
      index: true
    },

    status: {
      type: String,
      enum: ["actif", "inactif", "VIP", "bloque"],
      default: "actif",
      index: true
    },

    source: {
      type: String,
      enum: ["manuel", "import", "formulaire", "api"],
      default: "manuel",
      index: true
    },

    stats: {
      totalOrders: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
      lastOrderAt: Date,
      lastContactAt: Date,
      emailsSent: { type: Number, default: 0 },
      callsMade: { type: Number, default: 0 },
      ticketsCreated: { type: Number, default: 0 }
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

contactSchema.index({ shopId: 1, email: 1 }, { unique: true });
contactSchema.index({ shopId: 1, deletedAt: 1, createdAt: -1 });

contactSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

module.exports = mongoose.model("Contact", contactSchema);
