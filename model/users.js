const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  password: {
    type: String,
    required: [true, "Please enter your password"],
    miniLength: [8, "Password shuld be of 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    require: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Confirm password does not match!.",
    },
    select: false,
  },
  passwordChangeAt: Date,
});

// encrypt password
userSchema.pre("save", async function (next) {
  // encypt password before saving it
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// compare password wit db password
userSchema.methods.comparePasswordInDB = async function (pswd, pswdDB) {
  return await bcrypt.compare(pswd, pswdDB);
};

// if user change password
userSchema.methods.isPasswordChanged = async function (JWTtimeStamp) {
  if (this.passwordChangeAt) {
    // changing passwordchangeAt to seconds
    const pwdAtToTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    if (pwdAtToTimestamp) {
      return JWTtimeStamp < pwdAtToTimestamp;
    }
    console.log(pwdAtToTimestamp, JWTtimeStamp);
  }
  return false;
};

// model
const User = mongoose.model("User", userSchema);

module.exports = User;
