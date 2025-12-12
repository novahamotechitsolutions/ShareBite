const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../utils/mailer');

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '2', 10);

// Helper to generate numeric OTP of length 6
function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

// Request OTP for login (passwordless)
// body: { email, role } role optional but helps frontend routing
router.post('/request-otp', async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Optionally check role and existence
    const user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, you can either reject or create temporary user.
      // We'll create a temporary user record so they can complete details later.
      await User.create({ email, role: role || 'donor', temp: true });
    }

    const otp = generateOtp(6);

    // Save OTP in DB
    await Otp.create({ email, otp, purpose: 'login' });

    // Send email
    await sendOtpEmail(email, otp);

    return res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
// body: { email, otp }
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    // Find OTP document that is not expired
    const cutoff = new Date(Date.now() - OTP_EXPIRY_MINUTES * 60000);
    const found = await Otp.findOne({ email, otp, createdAt: { $gte: cutoff } });

    if (!found) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // OTP ok — delete all OTPs for this email
    await Otp.deleteMany({ email });

    // Find user
    let user = await User.findOne({ email });
    if (!user) {
      // create permanent user if not exist
      user = await User.create({ email, role: 'donor', temp: false });
    } else if (user.temp) {
      // mark as permanent on first successful verification
      user.temp = false;
      await user.save();
    }

    // Issue JWT (you can customize claims)
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return res.json({ message: 'OTP verified', token, user: { email: user.email, role: user.role, id: user._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Request OTP for registration
router.post('/register-request-otp', async (req, res) => {
  try {
    const { email, role, name } = req.body;
    if (!email || !role) return res.status(400).json({ message: "Email & role required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const otp = generateOtp(6);

    // Save OTP with purpose 'register'
    await Otp.create({ email, otp, purpose: "register" });

    // Send OTP
    await sendOtpEmail(email, otp);

    return res.json({ message: "OTP sent to registered email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify registration OTP and create account
router.post('/register-verify-otp', async (req, res) => {
  try {
    const { email, otp, name, role } = req.body;

    if (!email || !otp || !role)
      return res.status(400).json({ message: "Missing data" });

    const cutoff = new Date(Date.now() - OTP_EXPIRY_MINUTES * 60000);
    const match = await Otp.findOne({ email, otp, purpose: "register", createdAt: { $gte: cutoff } });

    if (!match) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Delete OTP after verification
    await Otp.deleteMany({ email });

    // Create real user
    const user = await User.create({
      email,
      name,
      role,
      temp: false
    });

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: "7d" }
    );

    return res.json({ message: "Registered successfully", user, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
