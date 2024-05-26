const User = require("./../../model/users");
const Users = require("./../../model/users");
const asyncErrorHandling = require("./../error/asynError");
const ErrorHandling = require("./../error/errorHanding");
const errorHandling = require("./../error/errorHanding");
const jwt = require("jsonwebtoken");
const util = require("util");

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
    next(error)
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
  req.userExist = userExist
  next();
});


// user Restrictions
exports.userRestriction = (rule)=>{
    return (req, res, next)=> {
  if(req.userExist.rule !== rule){
    const error = new errorHandling('You do not have permission to delete this date', 403)
    next(error)
  } 
  next()
    }
}
