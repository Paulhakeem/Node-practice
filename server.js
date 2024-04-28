// modules
const env = require("dotenv");
const mongoose = require("mongoose");
const movieRouter = require("./express/movieRoute/route"); // modules
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

//   creating a schema
const movieSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name required"]},
    descrption: String,
    duration: {type: Number, required: [true, "Duration requred"]},
    rating: {type: Number, default: 1.0}
})
// creating a model
const movie = mongoose.model('movie', movieSchema)



app.use("/api/v1/movies", movieRouter); // CREATING route
//   server
app.listen(8080, () => {
  console.log("Server in running");
});
