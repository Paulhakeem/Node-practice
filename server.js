// modules
const env = require("dotenv");
const mongoose = require("mongoose");
const movieRouter = require("./express/movieRoute/route");
const userAuthRouter = require("./express/movieRoute/userAuth")
const ErrorHandling = require("./express/error/errorHanding")
const globalError = require("./express/error/errorController")
const morgan = require("morgan"); // modules
const express = require("express");
let app = express();

env.config({ path: "./config.env" });
app.use(express.json()); // middleware
app.use(express.static("./public"));
app.use(morgan("dev")); // middleware

// connecting node with mongodb da
mongoose
  .connect(process.env.CONNECTION_STR, {})
  .then((conn) => {
    console.log("connection successful!!");
  })
// save to database

// ROUTERS
app.use("/api/v1/movies", movieRouter); // CREATING route
app.use("/api/v1/users", userAuthRouter);
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
app.use(globalError)
//   server
const server = app.listen(8080, () => {
  console.log("Server in running");
});
// hundle rejected promises globally
process.on("unhandledRejection", (err)=> {
  console.log(err.name, err.message);
  console.log("server shuting down...");
  server.close(()=> {
    process.exit(1)
  })
})