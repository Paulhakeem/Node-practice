const User = require("./../../model/users");
const Users = require("./../../model/users");
const asyncErrorHandling = require("./../error/asynError");
const ErrorHandling = require("./../error/errorHanding");
const errorHandling = require("./../error/errorHanding");
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("./../email/nodemailer");
const crypto = require("crypto");

// function handling user
const userTokens = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.EXP_DATE,
  });
};

// reusable function
const createSendResponse = (user, statusCode, res) => {
  const token = userTokens(user._id);
  // create cookie for token
  const options = {
    maxAge: process.env.EXP_DATE,
    httpOnly: true,
  };

  if ((process.env.NODE_ENV = "production")) {
    options.secure = true;
  }
  user.password = undefined;

  res.cookie("jwt", token, options);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      User,
    },
  });
};

//create a new user / post request
exports.createUser = asyncErrorHandling(async (req, res, next) => {
  const newUser = await Users.create(req.body);
  console.log(newUser);
  createSendResponse(newUser, 201, res);
  next();
});

// login user
exports.login = asyncErrorHandling(async (req, res, next) => {
  let { email, password } = req.body;
  // check if user provide the above info
  if (!email || !password) {
    const error = new errorHandling(
      "Please provide your email and Password",
      400
    );
    return next(error);
  }

  // check the user info & filter
  const loginUser = await Users.findOne({ email }).select("+password");
  const isMatch = await loginUser.comparePasswordInDB(
    password,
    loginUser.password
  );
  // check user
  if (!loginUser || !isMatch) {
    const userError = new ErrorHandling("Incorrect Email or Password", 400);
    return next(userError);
  }
  createSendResponse(loginUser, 200, res);
});

// protecting routes
exports.protectRoutes = asyncErrorHandling(async (req, res, next) => {
  // Read user token
  const userToken = req.headers.authorization;
  let tokens;
  if (userToken && userToken.startsWith("Bearer")) {
    tokens = userToken.split(" ")[1];
  }
  if (!tokens) {
    const error = new errorHandling("Invalid token", 401);
    next(error);
  }
  // validate tokens
  const promiseToken = await util.promisify(jwt.verify)(
    tokens,
    process.env.SECRET_STR
  );
  // if user exist
  const userExist = await User.findById(promiseToken.id);
  if (!userExist) {
    const error = new errorHandling(
      "User does not exist!. Please check your email and password",
      401
    );
    next(error);
  }
  // if user change the password
  const passwordChanged = await userExist.isPasswordChanged(promiseToken.iat);
  if (passwordChanged) {
    const error = new errorHandling(
      "The password has been change!, Please login again",
      401
    );
    next(error);
  }

  // allow user to access the route
  req.userExist = userExist;
  next();
});

// user Restrictions
exports.userRestriction = (rule) => {
  return (req, res, next) => {
    if (req.userExist.rule !== rule) {
      const error = new errorHandling(
        "You do not have permission to delete this date",
        403
      );
      next(error);
    }
    next();
  };
};

// FORGETING PASSWORD
exports.forgetPassword = asyncErrorHandling(async (req, res, next) => {
  // 1: GET USER POST EMAIL
  const userEmail = await User.findOne({ email: req.body.email });

  if (!userEmail) {
    const error = new errorHandling("Email not found in the database", 404);
    next(error);
  }

  //2: GENERATE RANDOM
  const randomToken = await userEmail.createResetPasswordToken();
  await userEmail.save({ validateBeforeSave: false });

  //  3: SEND THE RESET TOKEN TO USER EMAIL
  const resetURl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${randomToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetURl}\n\nLink expires in 10min.`;

  try {
    await sendEmail({
      email: userEmail.email,
      subject: "password change request",
      message: message,
    });
    res.status(200).json({
      status: "sucess",
      message: "Password resent Email sent to the user",
    });
  } catch (error) {
    userEmail.resetPasswordToken = undefined;
    userEmail.passwordResetTokenExp = undefined;
    userEmail.save({ validateBeforeSave: false });

    return next(new errorHandling("Email Not Sent!!", 500));
  }
  //   next();
});

// RESET PASSWORD
exports.resetPassword = asyncErrorHandling(async (req, res, next) => {
  // IF USER EXIST WITH THE GIVEN TOKEN AND TOKEN HAS NOT EXPIRED
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExp: { $gt: Date.now() },
  });

  if (!user) {
    const error = new ErrorHandling("The token is invalid or expired", 400);
    next(error);
  }

  // REESETING USER PASSWORD
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  user.passwordResetToken = undefined;
  user.passwordResetTokenExp = undefined;
  user.passwordChangeAt = Date.now();

  // saving the data
  user.save();
  // LOGIN THE USER AFTER CHANGE A PASSWORD
  createSendResponse(user, 200, res);
});
