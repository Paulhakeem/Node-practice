const express = require('express')
const usersController = require('./../Controllers/usersControllers')
const router = express.Router()

// post req
router.route("/signup").post(usersController.createUser)


module.exports = router