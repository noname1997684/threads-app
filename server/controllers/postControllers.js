import Post from '../models/postModels.js'
import {v2 as cloudinary} from 'cloudinary'
import User from '../models/userModels.js'
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
        const {username} = req.params
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        const posts = await Post.find({postedBy:user._id,parentId:null}).sort({createdAt:-1})
        res.status(200).json(posts)
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
        const posts= await Post.find({parentId:null}).sort({createdAt:-1})
        .populate({path:"replies"
        }).exec()
        
        res.status(200).json(posts)
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
        if(post.img){
            await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0])
        }
        await Post.findByIdAndDelete(postId)
        res.status(200).json({message:"Post deleted successfully"})
    } catch (error) {
        res.status(500).json({error:err.message})
    }
}