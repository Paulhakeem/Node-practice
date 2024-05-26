const express = require("express");
const mongoContollers = require("./../Controllers/mongoController");
const usersController = require('./../Controllers/usersControllers')

const router = express.Router();

// router.param('id', movieContollers.checkID)
// Middleware route
router
  .route("/high-rated-movies")
  .get(mongoContollers.getAllMovies);

  // aggrigation route
  router.route("/movie-stats").get(mongoContollers.getAggrigates)

router
  .route("/")
  .get(usersController.protectRoutes,mongoContollers.getAllMovies)
  .post(mongoContollers.createMovie);

router
  .route("/:id")
  .get(mongoContollers.getMovie)
  .patch(mongoContollers.updateMovie)
  .delete(usersController.protectRoutes, usersController.userRestriction('admin'), mongoContollers.deleteMovie);

module.exports = router;
