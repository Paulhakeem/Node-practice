const Users = require("./../../model/users")
const asyncErrorHandling = require("./../error/asynError");
const ErrorHandling = require("./../error/errorHanding");
const errorHandling = require('./../error/errorHanding')
const jwt = require('jsonwebtoken')

// function handling user
const userTokens = (id)=>{
return jwt.sign({id}, process.env.SECRET_STR, {
    expiresIn: process.env.EXP_DATE
})
}
//create a new user / post request
exports.createUser = asyncErrorHandling(async(req,res,next)=> {
    const newUser = await Users.create(req.body)
    const userCredentials = userTokens(newUser._id)
    res.status(201).json({
        status: "success",
        userCredentials,
        data: {
            user: newUser
        }
    })
    next()
})

// login user
exports.login = asyncErrorHandling(async(req, res, next)=> {
    const {email, password} = req.body
    // check if user provide the above info
    if(!email || !password) {
     const error = new errorHandling("Please provide your email and Password", 400)
     return next(error)
    }

    // check the user info & filter
    const loginUser = await Users.findOne({email}).select("+password")
    const isMatch = await loginUser.comparePasswordInDB(password, loginUser.password)
    // check user
    if(!loginUser || !isMatch){
        const userError = new ErrorHandling("Incorrect Email or Password", 400)
        return next(userError)
    }
    const tokens = userTokens(loginUser._id)

    res.status(200).json({
        status: "success",
        tokens
    })
})