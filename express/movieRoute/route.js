const express = require("express");
const mongoContollers = require("./../Controllers/mongoController");

const router = express.Router();

// router.param('id', movieContollers.checkID)

router
  .route("/")
  .get(mongoContollers.getAllMovies)
  .post(mongoContollers.createMovie);

router
  .route("/:id")
  .get(mongoContollers.getMovie)
  .patch(mongoContollers.updateMovie)
  .delete(mongoContollers.deleteMovie);

module.exports = router;
