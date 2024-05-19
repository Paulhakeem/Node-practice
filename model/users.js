const mongoose = require("mongoose");
const validator = require("validator");
const { validate } = require("./movies");

// user schem
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address."],
    validator: [validator.isEmail],
  },
  password:{
    type: String,
    required: [true, "Please enter your password"],
    maxLength: [8, "Password shuld be of 8 characters"],
    validator: [validator.isStrongPassword]
  },
  confirmPassword: {
    type: String,
    require: [true, "Please confirm your password"]
  }

});

// model
const User = mongoose.model('User', userSchema)

module.exports = User
