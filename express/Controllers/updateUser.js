const User = require("./../../model/users");
const Users = require("./../../model/users");
const asyncErrorHandling = require("./../error/asynError");
const errorHandling = require("./../error/errorHanding");
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const userControler = require("./usersControllers")

// UPDATING PASSWORD
exports.updatePassword = async (req, res, next) => {
    // GET USER FROM DB
    const user = await User.findOne(req.user._id).select("+password");
    // CHECK IF CURRENT PASSWORD IS CORRECT
    if (
      !(await user.comparePasswordInDB(req.body.currentPassword, user.password))
    ) {
      return next(
        new errorHandling("The current password you provide is wrong", 401)
      );
    }
    // IF IS CORRECT UPDATE USER PASSWORD WITH NEW VALUE
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
  
    await user.save();
    // LOGIN USER
    userControler.createSendResponse(user, 200, res)
  };