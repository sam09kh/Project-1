const mongoose = require("mongoose");

const user = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  verified: Boolean,
  lastToken: String,
  resetToken: String,
  resetTokenExpires: Date,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", user);
