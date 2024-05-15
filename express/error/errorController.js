// importing custom error
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
  return new ErrorHandling(msg, 404);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  //   development error/production errors
  if (process.env.NODE_ENV === "development") {
    devError(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") {
        error = castErrorHandle(error);
        console.log('hello');
    }
    prodError(res, error);
  }
  next();
};
