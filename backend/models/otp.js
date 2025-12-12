// backend/models/Otp.js
const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or phone used to send OTP
  code: { type: String, required: true },       // the OTP code
  attempts: { type: Number, default: 0 },       // how many verification attempts
  expiresAt: { type: Date, required: true },    // expiry time
  consumed: { type: Boolean, default: false },  // true after successful verify
  createdAt: { type: Date, default: Date.now }
});

// TTL index: optional if you want MongoDB to auto-delete expired docs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
