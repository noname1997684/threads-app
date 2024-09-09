import {Server} from 'socket.io';
import express from 'express';
import http from 'http';
import Conversation from '../models/conversationModels.js';
import Message from '../models/messageModels.js';

const app = express();
const server = http.createServer(app);
const userSockets={}
const io= new Server(server,{
    cors:{
        origin:'http://localhost:3001',
        methods:['GET','POST']
    }
})
export const getRecipientSocketId=(recipientID)=>{
    return userSockets[recipientID]
}
io.on('connection',(socket)=>{
    console.log('a user connected',socket.id)

    const userId= socket.handshake.query.userId

    if(userId != "underfined"){
        userSockets[userId]= socket.id
    }
    io.emit("onlineUsers",Object.keys(userSockets))
    socket.on('userSeenMessage',async({conversationId,senderId})=>{
        console.log(senderId,conversationId)
        try {
            await Message.updateMany({conversationId:conversationId,seen:false,sender:senderId},{$set:{seen:true}})
            await Conversation.updateOne({_id:conversationId},{$set:{'lastMessage.seen':true}})
            io.to(userSockets[senderId]).emit('messageSeen',{conversationId})
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected')
        delete userSockets[userId]
        io.emit("onlineUsers",Object.keys(userSockets))
    })
})




export {io,server,app}