const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    },
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User"
    },
    accountVerified:{
        type:Boolean,
        default:false
    },
    borrowedBooks:[{
        bookId:{
            type:mongoose.Schema.Types.ObjectId, // Reference to Book model in mongoDB 
            ref:"Book" 
        },
        returned:{
            type:Boolean,
            default:false
        },
        bookTitle:String,
        borrowedDate:Date,
        dueDate:Date,
    },
  ],
  avatar:{
    public_id:String,
    url:String, 
  },
  verificationCode:Number,
  verificationCodeExpire:Date,
  resetPasswordToken:String,
  resetPasswordExpire:Date,
},
    {
        timestamps:true,
    }
);

userSchema.methods.generateVerificationCode = function(){
    function generateRandomFiveDigitCode() {
        const firstDigit = Math.floor(Math.random() * 9) + 1; // Ensure the first digit is not zero
        const remainingDigits = Math.floor(Math.random()* 10000)
        .toString()
        .padStart(4,0);
        return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode = generateRandomFiveDigitCode();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now()+15*60*1000; // 15 minutes from now
    return verificationCode;
}

module.exports = mongoose.model("User",userSchema);
