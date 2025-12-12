const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Your ShareBite OTP',
    text: `Your OTP for ShareBite is: ${otp}. It will expire in ${process.env.OTP_EXPIRY_MINUTES || 2} minutes.`
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
