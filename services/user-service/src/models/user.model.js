const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
  role: { type: String, default: "user", enum: ["user", "super_admin"] },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  loginAttempts: { type: Number, default: 0},
  lockUntil: {type: Date},
  isBlocked: {type: Boolean,default: false}
}, { timestamps: true });

// Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparer mot de passe
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
