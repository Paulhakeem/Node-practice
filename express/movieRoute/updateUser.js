const usersController = require("./../Controllers/usersControllers");
const updateUser = require("./../Controllers/updateUser");

const express = require("express");
const router = express.Router();

router.route("/getUsers").get(updateUser.getAllUsers);

router
  .route("/updatePassword")
  .patch(usersController.protectRoutes, updateUser.updatePassword);

router
  .route("/updateMe")
  .patch(usersController.protectRoutes, updateUser.updateMe);

  router
  .route("/deleteMe")
  .delete(usersController.protectRoutes, updateUser.deleteMe);

module.exports = router;
