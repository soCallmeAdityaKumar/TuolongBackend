import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose, { Types } from "mongoose";
import { User } from "../model/user.models.js";


const registerUser=asyncHandler(async(req,res)=>{
     

    const {fullname,phoneNumber,password}=req.body;

    if(
        [fullname,phoneNumber,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({phoneNumber})

    if(existedUser){
        throw new ApiError(409,"User with phonenumber already existed")
    }

    let contact=[]
    const user= await User.create({
        fullname,
        phoneNumber,
        password,
        contact
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )

})


const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken;
        await user.save({validateBeforesSave:false})
        return {accessToken,refreshToken}

    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


const loginUser=asyncHandler(async(req,res)=>{

    const {phoneNumber,password}=req.body;
    if((!phoneNumber)){
        throw new ApiError(400,"PhoneNumber is required")
    }

    const user=await User.findOne({
        phoneNumber
    })
    if(!user){
        throw new ApiError(404,"User doesnot exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedinuser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedinuser,accessToken,refreshToken
        },
        "User logged in Successfully"
        )
    )

})



const addContacts=asyncHandler(async(req,res)=>{
    
    const {phoneNumber, fullname}=req.body;

    const user = await User.findById(req.user?._id);

    user.contacts.push({fullname,phoneNumber});

    await user.save({validateBeforeSave:true})

    return res.status(200).json(new ApiResponse(200,{},`${fullname} added to the contacts`))

})




export {registerUser,loginUser,addContacts}