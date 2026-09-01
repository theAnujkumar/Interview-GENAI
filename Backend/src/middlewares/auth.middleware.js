const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser(req,res,next)
{
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklist = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklist) {
        return res.status(401).json({
            message: "Token is invalid."
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded
        next()
        // directly go to getMeController or this can directly access from req.body
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid token."
        })
    }

}

module.exports = {authUser}