const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, enum: ['donor','ngo','acceptor'], required: true },
  createdAt: { type: Date, default: Date.now },
  // add other fields your frontend expects, e.g. address, phone...
  temp: { type: Boolean, default: false } // flag for temporary/unverified users if needed
});

module.exports = mongoose.model('User', userSchema);
