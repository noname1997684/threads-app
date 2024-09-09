import Conversation from "../models/conversationModels.js"
import Message from "../models/messageModels.js"
import { v2 as cloudinary } from "cloudinary"
import { getRecipientSocketId,io } from "../utils/socket.js"
export const sendMessage = async (req, res) => {
    try {
        const {recipientId,text}= req.body
        let {img}= req.body
        const senderId= req.user._id
        
        let conversation = await Conversation.findOne({
            participants: {$all:[senderId, recipientId]}
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,recipientId],
                lastMessage:{
                    sender:senderId,
                    text: text||"",
                    img:img||"",
                    seen:false
                }
            })

        await conversation.save()
        }
        if(img){
            const uploadResponse= await cloudinary.uploader.upload(img)
            img= uploadResponse.secure_url
        }
        const message =await Message.create({
            conversationId:conversation._id,
            sender:senderId,
            text:text||"" ,
            img:img||"",
            seen:false
        })
        await Promise.all([
            message.save(),
            conversation.updateOne({
                lastMessage:{
                    sender:senderId,
                    text:text||"",
                    img:img||""
                   
                }
            })
        ])
        const recipientSocketId= getRecipientSocketId(recipientId)
        if(recipientSocketId){
            io.to(recipientSocketId).emit("newMessage",message)
        }
        res.status(200).json(message)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId= req.user._id
        const conversations = await Conversation.find({
            participants: userId
        }).populate({path:"participants",select:"username profilePicture"})
        conversations.forEach(conversation=>{
            conversation.participants= conversation.participants.filter(participant=>participant._id.toString()!==userId.toString())

        })
        res.status(200).json(conversations)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id}= req.params
        const userId= req.user._id
        const conversation= await Conversation.findOne({
            participants: {$all:[userId,id]}
 })
        if(!conversation){
            return res.status(404).json({error:"Conversation not found"})
        }
        const messages= await Message.find({
            conversationId: conversation._id
        }).sort({createdAt:1})
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
} 