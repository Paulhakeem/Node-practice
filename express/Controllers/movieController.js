const fs = require('fs')

let movies = JSON.parse(fs.readFileSync("./express/movies.json"));

// Route functions(refactor my code)
exports.checkID = (req, res, next, value) => {
console.log(`movie ID = ${value}`);
next()
}

exports.validateMovie = (req, res, next) => {
    if(!req.body.name || !req.body.date) {
        res.status(400).json({
            status: "fail",
            data: {
                message: "Not a valid movie something is messing"
            }
        })
    }
    next()
}
// GET METHOD
exports.getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      movies: movies,
    },
  });
};

// GET METHOD
exports.getMovie = (req, res) => {
  // convert ID into number type
  const id = req.params.id * 1;
  // find the ID of a movie
  let movie = movies.find((el) => el.id === id);
  if (movie) {
    return res.status(201).json({
      status: "success",
      data: {
        movie: movie,
      },
    });
  }
  res.status(404).json({
    status: "fail",
    data: {
      text: `Movie with ${id} not found`,
    },
  });
};

// POST METHOD
exports.createMovie = (req, res) => {
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
};

// PATCH METHOD
exports.updateMovie = (req, res) => {
  const id = req.params.id * 1;
  // find the movie ID
  const updateMovie = movies.find((el) => el.id === id);
  //   check if the movie with ID exist
  if (!updateMovie) {
    res.status(404).json({
      status: "failed",
      data: {
        text: `Movie with ${id} not found`,
      },
    });
  }
  //  find the index of updated movie
  const movieIndex = movies.indexOf(updateMovie);

  // replace movie with the updated one
  movies[movieIndex] = updateMovie;
  // creating an object
  Object.assign(updateMovie, req.body);
  // writing file
  fs.writeFile("./express/movies.json", JSON.stringify(movies), (err) => {
    res.status(200).json({
      status: "sucess",
      data: {
        movies: updateMovie,
      },
    });
  });
};

// DeleTe method
exports.deleteMovie = (req, res) => {
  const id = req.params.id * 1;
  const deleteMovie = movies.find((el) => el.id === id);
  if (!deleteMovie) {
    res.status(404).json({
      status: "failed",
      data: {
        text: `Movie object with ID of ${id} not found`,
      },
    });
  }
  const index = movies.indexOf(deleteMovie);
  movies.splice(index, 1);
  fs.writeFile("./express/movies.json", JSON.stringify(movies), (err) => {
    res.status(204).json({
      status: "Deleted",
      data: {
        movies: null,
      },
    });
  });
};