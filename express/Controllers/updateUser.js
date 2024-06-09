const User = require("./../../model/users");
const Users = require("./../../model/users");
const asyncErrorHandling = require("./../error/asynError");
const errorHandling = require("./../error/errorHanding");
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const userControler = require("./usersControllers");

// usable function
const filterObj = (Obj, ...alowedFields) => {
  const newObj = {};
  Object.keys(Obj).forEach((prop) => {
    if (alowedFields.includes(prop)) newObj[prop] = Obj[prop];
  });

  return newObj;
};

// GET ALL USERS 
exports.getAllUsers = asyncErrorHandling(async(req, res, next) => {
    const users = await Users.find()
    res.status(200).json({
        status: "success", 
        users: users.length,
        data: {
            users
        }
    })
})
// UPDATING PASSWORD
exports.updatePassword = async (req, res, next) => {
  // GET USER FROM DB
  const user = await User.findById(req.user._id).select("+password");
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
  userControler.createSendResponse(user, 200, res);
};

//   UPDATE A USER
exports.updateMe = asyncErrorHandling(async (req, res, next) => {
  // Checking if user enter his/her password
  if (req.body.password || req.body.confirmPassword) {
    const error = new errorHandling(
      "You not allowed to change your password in this section",
      400
    );
    return next(error);
  }
  const requiredObj = filterObj(req.body, "name", "email");
  const user = await User.findByIdAndUpdate(req.user.id, requiredObj, {
    runValidators: true,
    new: true,
  });

  userControler.createSendResponse(user, 200, res);
});

// DELETE A USER
exports.deleteMe = asyncErrorHandling(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
});
