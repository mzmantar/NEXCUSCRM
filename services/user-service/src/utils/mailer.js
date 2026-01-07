const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Verification email
const sendVerificationEmail = async (email, token) => {
  await transporter.sendMail({
    from: `"Shop Service" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `<p>Thank you for signing up.</p>
           <p>Your verification code is: <strong style="font-size: 24px; color: #2563eb;">${token}</strong></p>
           <p>Enter this code to verify your account.</p>`
  });
};

// Reset password email
const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Shop Service" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>You requested a password reset.</p>
           <p>Click the link below to set a new password:</p>
           <a href="${url}">Reset my password</a>`
  });
};

// Delete account confirmation email
const sendDeleteAccountEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/confirm-delete-account?token=${token}&email=${encodeURIComponent(email)}`;
  await transporter.sendMail({
    from: `"Shop Service" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Confirm account deletion",
    html: `<p>You requested to delete your account.</p>
           <p><strong>This action is permanent and cannot be undone.</strong></p>
           <p>Your account and all associated shops will be permanently deleted.</p>
           <p>Click the link below to confirm the deletion:</p>
           <a href="${url}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm account deletion</a>
           <p>If you did not request this, please ignore this email.</p>
           <p>This link will expire in 24 hours.</p>`
  });
};


module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendDeleteAccountEmail,
};