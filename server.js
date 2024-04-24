// modules
const env = require('dotenv')
const movieRouter = require('./express/movieRoute/route') // modules
const morgan = require("morgan"); // modules
const express = require("express"); 
let app = express();

env.config({path: "./config.env"})
console.log(process.env);
app.use(express.json()); // middleware
app.use(express.static("./public"))
app.use(morgan("dev"));// middleware

app.use("/api/v1/movies",movieRouter) // CREATING route
//   server
app.listen(8080, () => {
  console.log("Server in running");
});
