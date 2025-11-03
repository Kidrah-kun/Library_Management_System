const ErrorHandler = require("../middlewares/errorMiddlewares.js").ErrorHandler;
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const {User} = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendVerificationCode = require("../utils/sendVerificationCode.js");

const register = catchAsyncErrors(async(req,res,next)=>{
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return next(new ErrorHandler("Please enter all fields",400));
        }
        const isRegistered = await User.findOne({email,isVerified:true});
        if(isRegistered){
            return next(new ErrorHandler("User already registered, please login",400));
        }

        const registerationAttemptsByUser = await User.find({
            email,
            isVerified:false
        })

        if(registerationAttemptsByUser.length >=5 ){
            return next(new ErrorHandler("Too many registeration attempts, please try again later",400));
        }
        if(password.length < 6 || password.length > 16){
            return next(new ErrorHandler("Password must be between 6 and 16 characters",400));
        }

        const hashedPassword = await bcrypt.hash(password,10);

        // creating user here
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        })
        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode,email,res);

    }catch(error){
        next(error);
    }
});