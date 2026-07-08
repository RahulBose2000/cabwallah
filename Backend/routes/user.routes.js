const express = require("express");
const router = express.Router();
const userController=require('../controllers/user.controllers')
const { body } = require("express-validator");
const { authUser } = require("../middlewares/auth_middleware");

router.post("/register",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 character long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 character long')

],userController.registerUser);


//login post route
router.post('/login',[
    body("email").exists().isEmail(), body("password").exists()
],userController.loginUser);


router.get('/profile',authUser,userController.getUserProfile);

router.get('/logout',authUser,userController.logOutUser);



module.exports = router;