const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false },
  role: { type: String, enum: ['donor','ngo','acceptor','admin'], default: 'donor' },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

UserSchema.methods.clearOtp = function () {
  this.otp = undefined;
  this.otpExpiry = undefined;
  return this.save();
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
