const {ErrorHandler} = require("../middlewares/errorMiddlewares.js");
const {catchAsyncErrors} = require("../middlewares/catchAsyncErrors.js");
const User = require("../models/userModel.js");
const { v2: cloudinary } = require("cloudinary");
const bcrypt = require("bcrypt");

const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ accountVerified: true });
    res.status(200).json({
        success: true,
        users,
    });
});

const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Admin avatar is required",400));
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered", 400));
    }

    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }

    const { avatar } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if(!allowedFormats.includes(avatar.mimetype)){
        return next(new ErrorHandler("Only jpg, jpeg, png, webp formats are allowed for avatar",400));
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath,{
        folder:"Library_Management_System_Admins_Avatars"
    })

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("cloudinary error :" + cloudinaryResponse.error || "Unknown error.");
        return next(new ErrorHandler("faied to upload avatar image to cloudinary.",500));
    }

    const admin = await User.create({
        name,
        email,
        password: hashPassword,
        role: "Admin",
        accountVerified: true,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    
    res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        admin,
    })
});
 
module.exports = { getAllUsers, registerNewAdmin };