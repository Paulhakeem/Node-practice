const express = require("express");
const movieContollers = require("./../Controllers/movieController");

const router = express.Router();

// router.param('id', movieContollers.checkID)

router
  .route("/")
  .get(movieContollers.getAllMovies)
  .post(movieContollers.validateMovie, movieContollers.createMovie);

router
  .route("/:id")
  .get(movieContollers.getMovie)
  .patch(movieContollers.updateMovie)
  .delete(movieContollers.deleteMovie);

module.exports = router;
