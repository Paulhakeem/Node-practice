const Users = require("./../../model/users")
const asyncErrorHandling = require("./../error/asynError");
const jwt = require('jsonwebtoken')
//create a new user / post request
exports.createUser = asyncErrorHandling(async(req,res,next)=> {
    const newUser = await Users.create(req.body)
    const userCredentials = jwt.sign({name: newUser._id}, process.env.SECRET_STR, {
        expiresIn: process.env.EXP_DATE
    })
    res.status(201).json({
        status: "success",
        userCredentials,
        data: {
            user: newUser
        }
    })
    next()
})