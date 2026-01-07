const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  shopId: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  
  contactPerson: String,
  email: String,
  phone: String,
  
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  
  taxId: String,
  paymentTerms: String, // ex: "Net 30", "COD"
  rating: { type: Number, min: 1, max: 5 },
  categories: [String], // categories of products supplied
  
  isActive: { type: Boolean, default: true },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Supplier", SupplierSchema);
