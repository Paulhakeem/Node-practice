const express = require("express"); // modules
const movieRouter = require('./express/movieRoute/route') // modules
const morgan = require("morgan"); // modules
let app = express();
app.use(express.json()); // middleware
app.use(morgan("dev"));// middleware

app.use("/api/v1/movies",movieRouter) // CREATING route
//   server
app.listen(8080, () => {
  console.log("Server in running");
});
