import mongoose from "mongoose";

const notificationSchema= new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:String,
        enum:['like','comment'],
        required:true
    },
},{timestamps:true});

const Notification = mongoose.model('Notification',notificationSchema);

export default Notification;