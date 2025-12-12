const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['login','register'], default: 'login' },
  createdAt: { type: Date, default: Date.now, index: true }
});

// TTL index will remove documents after expiry seconds set by server at startup (or configure here)
module.exports = mongoose.model('Otp', otpSchema);
