const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */

// register or signUp user controller
async function registerUserController(req,res)
{
    try{
    const {username,email,password} = req.body

    if(!username || !email || !password)
    {
        return res.status(400).json({
            message:"please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {username:username},
            {email:email}
        ]
    })
    /* isUserAlreadyExists.username == username*/
    if(isUserAlreadyExists)
    {
        return res.status(400).json({
            success : false,
            message:"Account already exists with this username or email address"
        })
    }

    const hash = await bcrypt.hash(password,10)

    // create a new user in the database
    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
        {username : user.username, id: user._id},
        process.env.JWT_SECRET,
        {expiresIn : "1h"}
    )

    res.cookie("token",token)

    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "register a user failure . please try again",
        })
    }
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req,res)
{
  try{

    const {email , password} = req.body

    if(!email || !password)
    {
        return res.status(400).json({
            success : false,
            message:"please provide email and password"
        })
    }

    const user = await userModel.findOne({email:email})
    if(!user)
    {
        return res.status(400).json({
            success : false,
            message:"Account does not exist with this email address"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid)
    {
        return res.status(400).json({
            success : false,
            message:"Invalid password"
        })
    }

    const token = jwt.sign(
        {username : user.username, id: user._id},
        process.env.JWT_SECRET,
        {expiresIn : "1h"}
    )
    res.cookie("token",token)
    res.status(200).json({
        success:true,
        message:"User logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
  }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "login failure . please try again",
        })
    }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) 
{
    try{
    const token = req.cookies.token

    // token should be go to token black list
    if(token)
    {
        await tokenBlacklistModel.create({token})
    }

    // token remove from cookies
    res.clearCookie("token")

    res.status(200).json({
        success : true,
        message: "User logged out successfully"
    })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "logout failure . please try again",
        })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res)
{
    try{

    // id can be get easily because of middlewares
    const user = await userModel.findById(req.user.id)

    if(!user)
    {
        return res.status(400).json({
            success : false, 
            message : "Could not get user details . please login"
        })
    }

    res.status(200).json({
        success : true, 
        message : "User details fetch successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Cannot get User details . please try again",
        })
    }
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}