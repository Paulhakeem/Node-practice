const usersController = require("./../Controllers/usersControllers");
const updateUser = require("./../Controllers/updateUser");

const express = require("express");
const router = express.Router();

router
  .route("/userUpdate")
  .patch(usersController.protectRoutes, updateUser.updatePassword);

module.exports = router;
