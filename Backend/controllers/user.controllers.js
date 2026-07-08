const blacklistTokenModel = require("../models/blacklistToken.model");
const userModel = require("../models/user.model");
const {createUser} = require('../services/user.services')
const {validationResult} = require('express-validator')

module.exports.registerUser=async(req,res,next)=>{
    // console.log(req.body)
    const error = validationResult(req); //validationResult() came from express-validator
    if(!error.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {fullname,email,password}= req.body;
     const   isEmailAlreadyExist = await userModel.findOne({email});
    
        if(isEmailAlreadyExist){
            return res.status(400).json({message:'User already exist'}); 
        }
    const hashedPassword = await userModel.hashPassword(password);

    const user = await createUser({
        firstname:fullname.firstname,lastname:fullname.lastname,email,password:hashedPassword
    });

    const token = await user.generateAuthToken();

    return res.status(201).json({token,user});

}

module.exports.loginUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){return res.status(400).json({error:errors.array()});}
    const {email,password}=req.body;
    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message:'ivalid credentials'});
    }
    
    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:"invalid credentials"});
    }

    const token = await user.generateAuthToken();

    res.cookie('token',token);

    res.status(200).json({token,user});
}

module.exports.getUserProfile= async(req,res,next)=>{
    
    res.status(200).json(req.user);


}

module.exports.logOutUser=async(req,res,next)=>{


    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({token});
    res.clearCookie('token');
    res.status(200).json({message:'logged out successfully'})
    
}