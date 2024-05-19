const Users = require("./../../model/users")
const asyncErrorHandling = require("./../error/asynError");
//create a new user / post request
exports.createUser = asyncErrorHandling(async(req,res,next)=> {
    const newUser = await Users.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            user: newUser
        }
    })
    next()
})