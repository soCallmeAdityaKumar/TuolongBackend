import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    coverImage:{
        type:String
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:[true,"Phone Number is required"]
    },
    pin:{
        type:Number
    },
    contacts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contact"
    }]
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))next()

    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        phoneNumber:this.phoneNumber,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User =mongoose.model("User",userSchema)
