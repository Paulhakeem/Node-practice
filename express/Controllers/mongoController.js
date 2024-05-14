// const router = require("../movieRoute/route");
const Movie = require("./../../model/movies");
const queryFeatures = require("./../../utils/queryFeatures");
const asyncErrorHandling = require("./../error/asynError");
const ErrorHandling = require("./../error/errorHanding")

// GET METHOD

exports.highRatedMovies = (req, res, next) => {
  // MIDDLEWARE
  req.query.limit = "5";
  req.query.rating = "rating";

  next();
};

exports.getAllMovies = asyncErrorHandling(async (req, res, next) => {
  // const features = new queryFeatures(Movie.find(), req.query)
  //   .filters()
  //   .sort()
  //   .limitFields()
  //   .pagenation();

  // const movie = await features.query;
  const movie = await Movie.find();

  res.status(200).json({
    status: "sucess",
    length: movie.length,
    data: {
      movie,
    },
  });
});

// GET METHOD
exports.getMovie = asyncErrorHandling(async (req, res, next) => {
  let movie = await Movie.findById(req.params.id);
  if (!movie) {
    const err = new ErrorHandling(`Cant find the movie ID on the server`, 404)
    return next(err);
  }
  res.status(200).json({
    status: "sucess",
    data: {
      movie,
    },
  });
});

// POST METHOD
exports.createMovie = asyncErrorHandling(async (req, res, next) => {
  // create document in mongodb

  let movie = await Movie.create(req.body);
  res.status(201).json({
    status: "sucess",
    data: {
      movie,
    },
  });
});

// PATCH METHOD
exports.updateMovie = asyncErrorHandling(async (req, res, next) => {
  let movieUpdate = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!movieUpdate) {
    const err = new ErrorHandling(`Cant find the movie ID on the server`, 404)
    return next(err);
  }
  res.status(200).json({
    status: "sucess",
    data: {
      movieUpdate,
    },
  });
});

// DeleTe method
exports.deleteMovie = asyncErrorHandling(async (req, res, next) => {
 const deleteMovie = await Movie.findByIdAndDelete(req.params.id);
 if (!deleteMovie) {
  const err = new ErrorHandling(`Cant find the movie ID on the server`, 404)
  return next(err);
}
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

// aggrigation method for calculation using $match and &group
exports.getAggrigates = asyncErrorHandling(async (req, res, next) => {
  const stats = await Movie.aggregate([
    {
      $match: { rating: { $gte: 5 } },
    },
    {
      $group: {
        _id: null,
        minRating: { $min: "$rating" },
        maxRating: { $max: "$rating" },
        avrDuration: { $avg: "$duration" },
        totalRating: { $sum: "$rating" },
        totalStats: { $sum: 1 },
      },
    },
    {
      $sort: { minRating: 1 },
    },
  ]);
  res.status(200).json({
    status: "sucess",
    length: stats.length,
    data: {
      stats,
    },
  });
});
