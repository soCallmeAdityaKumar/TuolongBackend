import mongoose,{Schema} from "mongoose";
const contactSchema=new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    coverImage:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:[true,"Phone Number is required"]
    },
},{timestamps:true})

export const Contact =mongoose.model("Contact",contactSchema)
