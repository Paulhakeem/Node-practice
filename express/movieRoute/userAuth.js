const express = require('express')
const usersController = require('./../Controllers/usersControllers')
const router = express.Router()

// post req
router.route("/signup").post(usersController.createUser)
router.route("/login").post(usersController.login)

module.exports = router