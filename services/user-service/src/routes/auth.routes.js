const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/register", [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("firstName").notEmpty().withMessage("Le prénom est requis"),
  body("lastName").notEmpty().withMessage("Le nom est requis")
], authController.register);

router.post("/login", [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est requis")
], authController.login);

router.post("/refresh-token", [
  body("refreshToken").notEmpty().withMessage("Le refresh token est requis")
], authController.refreshToken);

router.post("/logout", protect, authController.logout);

router.post("/verify-email", [
  body("token").notEmpty().withMessage("Le token est requis")
], authController.verifyEmail);

router.post("/forgot-password", [
  body("email").isEmail().withMessage("Email invalide")
], authController.forgotPassword);

router.post("/reset-password", [
  body("token").notEmpty().withMessage("Le token est requis"),
  body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères")
], authController.resetPassword);

router.post("/change-password", protect, [
  body("currentPassword").notEmpty().withMessage("Le mot de passe actuel est requis"),
  body("newPassword").isLength({ min: 6 }).withMessage("Le nouveau mot de passe doit contenir au moins 6 caractères")
], authController.changePassword);

router.get("/profile", protect, authController.getProfile);

router.put("/profile", protect, [
  body("email").optional().isEmail().withMessage("Email invalide"),
  body("name").optional().notEmpty().withMessage("Le nom ne peut pas être vide")
], authController.updateProfile);

module.exports = router;