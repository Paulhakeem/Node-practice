const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')

// user schem
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Please enter your email address."],
    validate: [validator.isEmail],
  },
  password:{
    type: String,
    required: [true, "Please enter your password"],
    miniLength: [8, "Password shuld be of 8 characters"],
    select: false
  },
  confirmPassword: {
    type: String,
    require: [true, "Please confirm your password"],
    validate: {
      validator: function(val){
        return val == this.password
       },
       message: "Confirm password does not match!."
    },
    select: false
  }

});

// encypt password
userSchema.pre("save", async function(next){
// encypt password before saving it
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
})

// model
const User = mongoose.model('User', userSchema)

module.exports = User
