const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  slug:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:   { type: String, required: true, lowercase: true, trim: true },
  phone:   { type: String, required: true },
  country: { type: String, required: true },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // relation 1-to-Many
  status:  { type: String, enum: ["pending", "active", "blocked"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);