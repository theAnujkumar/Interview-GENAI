// const {express} = require("express")

// const authRouter = express.Router

//              or

const { Router } = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
//const registerUserController = require('../controllers/auth.controller')
const authRouter = Router()

// jsDoc comments

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

 authRouter.post('/register',authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */

authRouter.post('/login', authController.loginUserController)


/**
 * @route POST /api/auth/logout
 * @desc clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get('/get-me', authMiddleware.authUser , authController.getMeController)

module.exports = authRouter