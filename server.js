const express = require("express");
const movieRouter = require('./express/movieRoute/route')
const morgan = require("morgan");
let app = express();
app.use(express.json()); // middleware
app.use(morgan("dev"));

app.use("/api/v1/movies",movieRouter)
//   server
app.listen(8080, () => {
  console.log("Server in running");
});
