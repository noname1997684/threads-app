import Post from '../models/postModels.js'
import {v2 as cloudinary} from 'cloudinary'
import User from '../models/userModels.js'
import fetchRepliesThread from '../utils/fetchRepliesThread.js'

const MAX_POST_RENDERS=5
export const createPost = async (req, res) => {
   
    try {
    const postedBy = req.user._id
    const {content} = req.body
   
    let {picURL} = req.body 
    if(!picURL && !content){
        return res.status(400).json({error:"Please add content or image to create post"})
    }
    if(picURL){
        const uploadedResponse = await cloudinary.uploader.upload(picURL)
        picURL = uploadedResponse.url
    }
    
    const newPost= await Post.create({
        postedBy,
        content,
        img:picURL
    })
    await newPost.save()
    await User.findByIdAndUpdate(postedBy,{$push:{posts:newPost._id}})
    res.status(201).json(newPost)
   } catch (err) {
    res.status(500).json({error:err.message})
   }
}
export const getUserPosts = async(req,res)=>{
    try {
        const {page}= req.query
        const {username} = req.params
        const user = await User.findOne({username})
       
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        const totalPost= await Post.find({postedBy:user._id,parentId:null}).countDocuments()

        const posts = await Post.find({postedBy:user._id,parentId:null}).sort({createdAt:-1}).skip(MAX_POST_RENDERS*(page-1)).limit(MAX_POST_RENDERS)

        const isNext= MAX_POST_RENDERS*(page-1)+ posts.length<totalPost
        res.status(200).json({posts,isNext})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

export const likePost = async(req,res)=>{
    try {
        const {id:postId}= req.params
        const userId= req.user._id
        
        const post= await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const hasLiked= post.likes.includes(userId)
     
        if(hasLiked){
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json({message:"Unlike post success"})
        }
        else{
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json({message:"Liked post success"})
        }
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
export const commentPost = async(req,res)=>{
    try {
        const {text}=req.body
        const {id:postId}= req.params
        const postedBy= req.user._id
       
        if(!text){
            return res.status(400).json({error:"Please add text to comment"})
        }
        const parentPost= await Post.findById(postId)
        if(!parentPost){
            return res.status(404).json({error:"Post not found"})
        }
        const comment=new Post({
            postedBy,
            content:text,
            parentId:postId
        })
        await comment.save()
        await Post.findByIdAndUpdate(postId,{$push:{replies:comment._id}})

        
        res.status(200).json(comment)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
export const getPost = async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        .populate({path:"replies", 
        populate:{path:"replies",
        model:Post
       }})
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({error:err.message})
    }
}
export const getFeedPosts = async(req,res)=>{
    try {
        const {page}= req.query
        const TotalPost= await Post.find({parentId:null}).countDocuments()

        const posts= await Post.find({parentId:null}).sort({createdAt:-1})
        .skip(MAX_POST_RENDERS*(page-1)).limit(MAX_POST_RENDERS)
        .populate({path:"replies"
        }).exec()
        const isNext= MAX_POST_RENDERS*(page-1)+ posts.length<TotalPost
        res.status(200).json({posts,isNext})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
export const deletePost = async(req,res)=>{
    try {
        const postId= req.params.id
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const childReplies= await fetchRepliesThread(postId)
        const childRepliesIds= [
            postId,
            ...childReplies.map(reply=>reply._id)
        ]
        
        const uniqueCreatorIds= new Set([
            ...childRepliesIds.map(reply=>reply?.postedBy?.toString()),
            post?.postedBy?.toString(),
        ].filter((id)=>id!==undefined))
        for(const replies of childReplies){
            if(replies.img){
                await cloudinary.uploader.destroy(replies.img.split('/').pop().split('.')[0])
            }
        }
        if(post.img){
            await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0])
        }
        await Post.deleteMany({_id:{$in:childRepliesIds}})
        await User.updateMany({_id:{$in:[...uniqueCreatorIds]}},{$pull:{posts:{$in:childRepliesIds}}})
        res.status(200).json({message:"Post deleted successfully"})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

export const getUserRepliedPosts = async(req,res)=>{
    try{
        const {page}= req.query

        const {username}= req.params
        const user= await User.findOne({username})
        const RepliePosts= await Post.find({parentId:null}).populate({path:"replies",match:{postedBy:{$eq:user._id}}}).exec()
        const filteredReplies= RepliePosts.filter(post=>post.replies.length>0)
        const totalReplies= filteredReplies.length
        const skippedReplies= filteredReplies.slice(MAX_POST_RENDERS*(page-1),MAX_POST_RENDERS*page)
        const isNext= MAX_POST_RENDERS*(page-1)+ skippedReplies.length<totalReplies
        res.status(200).json({posts:skippedReplies,isNext})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const getSearchPosts = async(req,res)=>{
    try {
        
        const {page,search}= req.query
        const totalPost= await Post.find({
            parentId:null,
            content:{
                $regex:search,
                $options:"i"
            }
        }).countDocuments()
        const posts=await Post.find({
            parentId:null,
            content:{
                $regex:search,
                $options:"i"
            }
        }).skip(MAX_POST_RENDERS*(page-1)).limit(MAX_POST_RENDERS).populate({path:"replies"}).exec()
        const isNext= MAX_POST_RENDERS*(page-1)+ posts.length<totalPost
    res.status(200).json({posts,isNext})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
    
}