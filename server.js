const express = require("express");
const fs = require("fs");
let app = express();

let movies = JSON.parse(fs.readFileSync("./express/movies.json"));

// Get request
app.get("/api/v1/movies", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      movies: movies,
    },
  });
});

// POST request
app.use(express.json());
app.post("/api/v1/movies", (req, res) => {
  // creating an ID for a new object
  const newID = movies[movies.length - 1].id + 1;
  // creating a new object
  const newMovie = Object.assign({ id: newID }, req.body);
  // push newmovie to movies
  movies.push(newMovie);
  // writing a new file
  fs.writeFile("./express/movies.json", JSON.stringify(movies), (err) => {
    res.status(200).json({
      status: "sucess",
      data: {
        movies: newMovie,
      },
    });
  });
});

app.listen(8080, () => {
  console.log("Server in running");
});
