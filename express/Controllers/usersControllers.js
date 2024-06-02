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
//create a new user / post request
exports.createUser = asyncErrorHandling(async (req, res, next) => {
  const newUser = await Users.create(req.body);
  const userToken = userTokens(newUser._id);
  res.status(201).json({
    status: "success",
    userToken,
    data: {
      user: newUser,
    },
  });
  next();
});

// login user
exports.login = asyncErrorHandling(async (req, res, next) => {
  const { email, password } = req.body;
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
  const tokens = userTokens(loginUser._id);

  res.status(200).json({
    status: "success",
    tokens,
  });
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
    const error = errorHandling("Invalid token", 401);
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

// forget password
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

// reset password
exports.resetPassword = async (req, res, nex) => {
  const token  = crypto.createHash('sha256').update(req.params.token).digest('hex')

  User.findOne({passwordResetToken: token})
};
