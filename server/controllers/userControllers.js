import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {v2 as cloundinary} from "cloudinary";
import generateCookiesAndToken from "../utils/generateCookiesAndToken.js";
const MAX_LENGTH=5
export const RegisterUser = async (req, res) => {
    try {
        const {password,username,name,email}= req.body
        const user=await User.find({$or:[{email},{username}]})
        if(user.length>0){
          return res.status(400).json({error:"User already exists!"})
        }

        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)
        const newUser= new User({
            name,
            username,
            email,
            password:hashedPassword
        })

        await newUser.save()
        if(newUser){
            generateCookiesAndToken(newUser._id,res)
        res.status(201).json({
            _id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            name:newUser.name,
            description:newUser.description,
            profilePicture:newUser.profilePicture,
            followers:newUser.followers,
            following:newUser.following
        })
        }else{
            res.status(401).json({error:"Failed to register user!"})
        }
        

    } catch (err) {
        res.status(400).json({error:err.message})
        console.log('Register request error' + err)
    }
    
}

export const LoginUser = async (req,res)=>{
    try{
        const {username,password}=req.body
    const user = await User.findOne({username})
    
    if(!user){
        return res.status(401).json({error:"No user found!"})
    }
    const validPassword= await bcrypt.compare(password,user.password)
    if(!validPassword){
        return res.status(401).json({error:"Password is incorrect!"})
    }
    generateCookiesAndToken(user._id,res)
    res.status(200).json({
        _id:user._id,
        username:user.username,
        email:user.email,
        name:user.name,
        description:user.description,
        profilePicture:user.profilePicture,
        followers:user.followers,
        following:user.following,
        posts:user.posts
    })
    }
    catch(err){
        res.status(400).json({error:err.message})
        console.log('Login request Error:' + err)
    }
}

export const logoutUser = async(req,res)=>{
    try {
        res.cookie('UserToken',"",{maxAge:1})
        res.status(200).json({message:"User logged out!"})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

export const getUserProfile = async(req,res)=>{
    const {query}= req.params
    try {
        let user
        if(mongoose.Types.ObjectId.isValid(query)){
            user= await User.findById(query).select('-password')
        }
        else{
        user= await User.findOne({username:query}).select('-password')
        }
        if(!user){
            return res.status(404).json({error:"User not found!"})
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}
export const updateUser = async(req,res)=>{
    const userId= req.user._id
    const{name,email,description,password,username}= req.body
    let {profilePicture}= req.body
    try {
        let user= await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found!"})
        }
        if(password){
            const salt= await bcrypt.genSalt(10)
            const hashedPassword= await bcrypt.hash(password,salt)
            user.password= hashedPassword
        }

        if(profilePicture){
            if(user.profilePicture){
                await cloundinary.uploader.destroy(user.profilePicture.split('/').pop().split('.')[0])
            }
            const uploadedUrl= await cloundinary.uploader.upload(profilePicture)
            profilePicture= uploadedUrl.secure_url 
        }
        user.username=username || user.username
        user.name=name || user.name
        user.email=email || user.email
        user.description=description || user.description
        user.profilePicture= profilePicture || user.profilePicture
        await user.save()
        user.password=null
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

export const followUser= async(req,res)=>{
    const userId= req.user._id
    const {id:followingId}= req.params
    try {
        const followingUser= await User.findById(followingId)
    const currentUser= await User.findById(userId)
    if(!followingUser){
        return res.status(404).json({error:"Following User not found!"})
    }
    const isFollowing= currentUser.following.includes(followingId)
    if(isFollowing){
       await currentUser.updateOne({$pull:{following:followingId}})
        await followingUser.updateOne({$pull:{followers:userId}})
    res.status(200).json({message:"Unfollowed success!"})
}else{
        await currentUser.updateOne({$push:{following:followingId}})
        await followingUser.updateOne({$push:{followers:userId}})
    res.status(200).json({message:"Followed success!"})
    }
    
    } catch (err) {
        res.status(400).json({error:err.message})
    }
    
}

export const getSuggestedUsers= async(req,res)=>{
    try {
        
        const {search,page}= req.query
        
        const userId= req.user._id
        
        const userFollowed = await User.findById(userId).select('following')
        let suggestedUsers
        let totalUsers
        if(!search){
        const users= await User.find({_id:{$ne:userId}})
        
        suggestedUsers= users.filter(user=>!userFollowed.following.includes(user._id))
        totalUsers= suggestedUsers.length
        suggestedUsers= suggestedUsers.slice((page-1)*MAX_LENGTH,page*MAX_LENGTH)
    } else{
        
       totalUsers= await User.find({_id:{$ne:userId},username:{$regex:search,$options:"i"}}).countDocuments()
        suggestedUsers= await User.find({_id:{$ne:userId},username:{$regex:search,$options:"i"}}).skip((page-1)*MAX_LENGTH).limit(MAX_LENGTH)
        
    }
        const isNext= MAX_LENGTH*(page-1)+ suggestedUsers.length<totalUsers
        res.status(200).json({suggestedUsers,isNext})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}