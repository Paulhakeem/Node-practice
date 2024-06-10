// modules
const env = require("dotenv");
const mongoose = require("mongoose");
const movieRouter = require("./express/movieRoute/route");
const userAuthRouter = require("./express/movieRoute/userAuth")
const ErrorHandling = require("./express/error/errorHanding")
const globalError = require("./express/error/errorController")
const updateUser = require("./express/movieRoute/updateUser")
const morgan = require("morgan"); // modules
const express = require("express");
const limitReq = require("express-rate-limit")
const helmet = require("helmet")
const sanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")

let app = express();

  // LIMIT REQUEST TO APIs
let limitRequest = limitReq({
  max: 1000,
  windowsMs: 60 * 60 * 1000,
  message: "We have receive to many request from this IP. Please try again later"
})

env.config({ path: "./config.env" });

app.use(helmet()) // setting up security headers
app.use(express.json()); // middleware
app.use(sanitize())
app.use(xss())
app.use(express.static("./public"));
app.use(morgan("dev")); // middleware
app.use("/api", limitRequest)


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
app.use("/api/v1/update", updateUser);
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