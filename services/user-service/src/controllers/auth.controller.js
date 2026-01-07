const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Shop = require("../models/shop.model");
const { generateAccessToken } = require("../config/jwt");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../utils/mailer");

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, shops } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (existingUser && !existingUser.isVerified) {
      await Shop.deleteMany({ owner: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }

    const newUser = new User({ firstName, lastName, email, password });

    const verificationToken = Math.floor(10000 + Math.random() * 90000).toString();
    newUser.verificationToken = verificationToken;

    await newUser.save();

    // Créer les shops ou créer un shop par défaut
    const shopsList = shops && shops.length > 0 ? shops : [{
      name: `${firstName}'s Shop`,
      email: email,
      phone: "0000000000",
      country: "Morocco"
    }];
    
    const shopDocs = await Promise.all(
      shopsList.map(async (shopData, index) => {
        const slug = shopData.slug || `${firstName.toLowerCase()}-shop-${index}`;
        const shop = new Shop({
          ...shopData,
          slug: slug,
          owner: newUser._id
        });
        await shop.save();
        return shop;
      })
    );
    newUser.shops = shopDocs.map(s => s._id);
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "Registration successful. Check your email to activate your account." });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("shops");

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ message: "Email not verified" });

    const MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS);
    const LOCK_TIME_MINUTES = Number(process.env.LOGIN_LOCK_MINUTES);
    const LOCK_TIME = LOCK_TIME_MINUTES * 60 * 1000;

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: "Account temporarily locked" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const previousAttempts = user.loginAttempts || 0;
      user.loginAttempts = previousAttempts + 1;

      // Lock account when max attempts reached
      if (previousAttempts < MAX_ATTEMPTS && user.loginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }

      await user.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Reset on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const shopId = user.shops && user.shops.length > 0 ? user.shops[0]._id.toString() : null;

    const accessToken = generateAccessToken({ 
      userId: user._id, 
      email: user.email,
      shopId: shopId,
      role: user.role 
    });

    res.status(200).json({
      message: "Login successful",
      accessToken
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.verifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, email } = req.body;
    if (!token) return res.status(400).json({ message: "Token is missing" });
    if (!email) return res.status(400).json({ message: "Email is missing" });

    const user = await User.findOne({ email, verificationToken: token }).populate("shops");
    if (!user) return res.status(400).json({ message: "Invalid token or email" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const shopId = user.shops && user.shops.length > 0 ? user.shops[0]._id.toString() : null;

    // Générer le token d'authentification
    const accessToken = generateAccessToken({ 
      userId: user._id, 
      email: user.email,
      shopId: shopId,
      role: user.role 
    });

    res.json({ 
      message: "Account verified successfully!",
      accessToken
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful. Please remove token from client." });
};

exports.refreshToken = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;
    
    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Générer un nouveau token
    const newAccessToken = generateAccessToken({ userId: user._id, email: user.email });
    
    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendResetPasswordEmail(email, token);
    res.json({ message: "Password reset email sent" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("shops");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile retrieved successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { firstName, lastName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    res.json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};