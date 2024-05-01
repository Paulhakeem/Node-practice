const router = require("../movieRoute/route");
const Movie = require("./../../model/movies");

// GET METHOD
exports.getAllMovies = async (req, res) => {
  try {
    let movie = await Movie.find();
    res.status(200).json({
      status: "sucess",
      length: movie.length,
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        message: error.message,
      },
    });
  }
};

// GET METHOD
exports.getMovie = async (req, res) => {
  try {
    let movie = await Movie.findById(req.params.id);
    res.status(200).json({
      status: "sucess",
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        message: error.message,
      },
    });
  }
};

// POST METHOD
exports.createMovie = async (req, res) => {
  // create document in mongodb
  try {
    let movie = await Movie.create(req.body);
    res.status(201).json({
      status: "sucess",
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        message: error.message,
      },
    });
  }
};

// PATCH METHOD
exports.updateMovie = async (req, res) => {
  try {
    let movieUpdate = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "sucess",
      data: {
        movieUpdate,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        message: error.message,
      },
    });
  }
};

// DeleTe method
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "sucess",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        message: error.message,
      },
    });
  }
};
