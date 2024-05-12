// modules
const env = require("dotenv");
const mongoose = require("mongoose");
const movieRouter = require("./express/movieRoute/route"); // modules
const ErrorHandling = require("./express/error/errorHanding")
const morgan = require("morgan"); // modules
const express = require("express");
let app = express();

env.config({ path: "./config.env" });
app.use(express.json()); // middleware
app.use(express.static("./public"));
app.use(morgan("dev")); // middleware

// connecting node with mongodb database
mongoose
  .connect(process.env.CONNECTION_STR, {})
  .then((conn) => {
    console.log("connection successful!!");
  })
  .catch((err) => {
    console.log("error");
  });

// save to database

// ROUTERS
app.use("/api/v1/movies", movieRouter); // CREATING route
// ERROR HANDLING ROUTE
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   data: {
  //     message: `Cant find the URL ${req.originalUrl} on the server`,
  //   },
  // });
  const err = new ErrorHandling(`Cant find the URL ${req.originalUrl} on the server`, 404)
  // err.status = "fail"
  // err.statusCode = 404
  next(err);
});

// GLOBAL ERROR HANDLNG
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500
  error.status = error.status || "error"
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message
  })
})
//   server
app.listen(8080, () => {
  console.log("Server in running");
});
