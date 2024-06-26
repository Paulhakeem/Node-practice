// importing custom error
const { JsonWebTokenError } = require("jsonwebtoken");
const ErrorHandling = require("./errorHanding");

const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong, please try again later!",
    });
  }
};

// handling production error
const castErrorHandle = (err) => {
  const msg = `Invalid value ${err.value} for filed ${err.path}`;
  return new ErrorHandling(msg, 400);
};
// dublicated error handling
const dublicatedError = (err) => {
  const name = err.keyValue.name;
  const message = `${name} is dublicated. Please use another name`;
  console.log(name);
  return new ErrorHandling(message, 400);
};
// validation error
const validationError = (err)=> {
  const allErrors = Object.values(err.errors).map(val => val.message)
  const errorMessage = allErrors.join(". ")
  const message = `validation error: ${errorMessage}`
  return new ErrorHandling(message, 400)
}

// token error
const JsonWebTokenErrors = (err)=> {
  return new ErrorHandling("invalid token", 401)
}

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  //   development error/production errors
  if (process.env.NODE_ENV === "development") {
    devError(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") {
      error = castErrorHandle(error);
      console.log("hello");
    } else if (error.code === 11000) error = dublicatedError(error);
    if ((error.name === "ValidationError")) error = validationError(error);
    if (error.name === "JsonWebTokenError") error = JsonWebTokenErrors(error)
    prodError(res, error);
  }
  next();
};
