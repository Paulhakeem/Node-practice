module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  //   development error/production errors
  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      stackTrace: error.stack,
      error: error,
    });
  } else if (process.env.NODE_ENV === "production") {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
          });
    }else{
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong, please try again later!'
        })
    }
  }
};
