import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import useShowToast from '../hooks/useShowToast'
import Message from './Message'
import MessageInput from './MessageInput'
import { useSocket } from '../context/SocketContext'
import userAtom from '../atoms/userAtom'
import messageSound from '../assets/sounds/messages.mp3'
const MessageContainer = () => {
    const selectedConversation= useRecoilValue(selectedConversationAtom)
    const showToast= useShowToast()
    const [messages,setMessages]= useState([])
    const [loading,setLoading]= useState(true)
    const endPointRef= useRef(null)
    const {socket}= useSocket()
    const currentUser= useRecoilValue(userAtom)
    const setConversations= useSetRecoilState(conversationsAtom)
   
    useEffect(()=>{
        socket.on("newMessage",(message)=>{
            console.log("hello")
            if(selectedConversation._id=== message.conversationId){
                setMessages([...messages,message])
            }
            if(!document.hasFocus()){
                const sound= new Audio(messageSound)
                sound.play()
            }
            setConversations((prev)=>{
                const newConversations= prev.map(conversation=>{
                    if(conversation._id === message.conversationId){
                        console.log(conversation)
                        return {...conversation,lastMessage:{
                            text:message.text,
                            sender:message.sender,
                            img:message.img
                        }}
                    }
                    return conversation
                })
                return newConversations
            })

        })
        
        return ()=> socket.off("newMessage")
    },[messages,selectedConversation,setConversations])
    useEffect(()=>{
        endPointRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])
    useEffect(()=>{
        const getMessgages= async()=>{
            setLoading(true)
            setMessages([])
            try {
                console.log(selectedConversation)
                if(selectedConversation.mock) return
                const res = await fetch(`/api/message/${selectedConversation?.userId}`)
                const data= await res.json()
                if(data.error){
                    showToast("Error",data.error,"error")
                    return
                }
                setMessages(data)
            } catch (error) {
                showToast("Error",error,"error")
            } finally{
                setLoading(false)
            }
        }
        getMessgages()
    },[selectedConversation,showToast])
    useEffect(()=>{
        const lastMessageIsFromOpposite= messages.length && messages[messages.length-1].sender !== currentUser._id 
        if(lastMessageIsFromOpposite){
            socket.emit('userSeenMessage',{conversationId:selectedConversation._id,senderId:selectedConversation.userId})
        }
        socket.on("messageSeen",({conversationId})=>{
            if(selectedConversation._id === conversationId){
                setMessages((prev)=>{
                    return prev.map(message=>{
                        return {...message,seen:true}
                    })
                })
                
                
            }
        })
        
    },[socket,messages,selectedConversation,currentUser._id])
    
    return (
    <Flex flex={70} bg={useColorModeValue("white","gray.dark")}
    borderRadius={"md"} flexDirection={"column"} p={2}
    >   
        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
            <Avatar src={selectedConversation.userProfilePicture}/>
            <Text>
                {selectedConversation.username}
            </Text>
        </Flex>
        <Divider/>
        <Flex flexDirection={"column"} gap={4} px={2} my={4} height={"400px"} overflowY={"auto"}>
         {loading && [0,1,2,3,4,5].map((_,i) => (
                <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i%2 === 0 ?"flex-start":"flex-end"}>
                    {i%2 ===0 &&(
                        <SkeletonCircle size={7}/>

                    )}
                    <Flex flexDirection={"column"} gap={1}>
                        <Skeleton h={"8px"} w={"250px"}/>
                        <Skeleton h={"8px"} w={"250px"}/>
                        <Skeleton h={"8px"} w={"250px"}/>
                    </Flex>
                        {i%2 !==0 &&(
                            <SkeletonCircle size={7}/>
                        )}
                        
                </Flex>
            ))}
            {!loading && messages.map((message)=>(
                <Flex key={message.id} direction={"column"}
                ref={messages.length-1 === messages.indexOf(message)? endPointRef:null}
                >
                    <Message key={message._id} message={message}
                    />
                </Flex> 
            ))}
        </Flex>
            <MessageInput setMessages={setMessages}/>
    </Flex>
  )
}

export default MessageContainer