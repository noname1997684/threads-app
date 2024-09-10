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
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    replies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
},{
    timestamps:true
})

const Post = mongoose.model('Post',postSchema)

export default Post