import mongoose from "mongoose";

const postSchema= mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        maxLength:200,

    },
    img:{
        type:String
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },
    replies:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        text:{
            type:String,
            required:true
        },
        profilePicture:{
            type:String
        },
        username:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})

const Post = mongoose.model('Post',postSchema)

export default Post