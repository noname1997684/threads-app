import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { GiConversation } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import {conversationsAtom,selectedConversationAtom}  from '../atoms/messagesAtom'
import MessageContainer from '../components/MessageContainer'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'
import Conversation from '../components/Conversation'

const ChatPage = () => {
    const [loading,setLoading]= useState(true)
    const [selectedConversation,setSelectedConversation]= useRecoilState(selectedConversationAtom)
    const [conversations,setConversations]= useRecoilState(conversationsAtom)
    const [search, setSeach]= useState("")
    const loginUser= useRecoilValue(userAtom)
    const showToast= useShowToast()
    const {socket,onlineUsers}= useSocket()
    
    useEffect(()=>{
         
        socket?.on("messageSeen",({conversationId})=>{
           
            setConversations((prev)=>{
                const newConversations= prev.map(conversation=>{
                    if(conversation._id === conversationId){
                        return{
                            ...conversation,
                            lastMessage:{
                                ...conversation.lastMessage,
                                seen:true
                            }
                        }
                    }
                    return conversation
                })
                return newConversations
            })
        })
    },[socket,setConversations])
    useEffect(()=>{
        const getConversations= async()=>{
            try {
                const res= await fetch('/api/message/conversations')
                const data= await res.json()
                
                if(data.error){
                    showToast("Error",data.error,"error")
                    return
                }
               if(data.length===0) return
                setConversations(data)
                
                setSelectedConversation({
                    _id:data[0]?._id,
                    userId:data[0]?.participants[0]._id,
                    username:data[0]?.participants[0].username,
                    userProfilePicture:data[0]?.participants[0].profilePicture
                })
        
            } catch (error) {
                showToast("Error",error,"error")             
            } finally{
                setLoading(false)
            }
        }
        getConversations()
        
    },[showToast,setConversations])
    
    const handleConversationSearch= async(e)=>{
        e.preventDefault()
        
        try {
            const res=await fetch(`/api/user/profile/${search}`)
            const data= await res.json()
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            if(data._id=== loginUser._id){
                showToast("Error","You can't start a conversation with yourself","error")
                return
            }
            
            const searchConversation= conversations.find(conversation => conversation.participants[0]._id=== data._id)
            
            if (searchConversation){ 
                setSelectedConversation({
                    _id:searchConversation._id,
                    userId:data._id,
                    username:data.username,
                    userProfilePicture:data.profilePicture
                })
            }
            else{
                const mockConversation={
                    mock:true,
                    lastMessage:{
                        text:"",
                        img:"",
                        sender:""
                    },
                    _id:Date.now(),
                    participants:[{
                        _id:data._id,
                        username:data.username,
                        profilePicture:data.profilePicture
                    }]
                }
                setSelectedConversation({
                    _id:mockConversation._id,
                    userId:data._id,
                    username:data.username,
                    userProfilePicture:data.profilePicture,
                    mock:true
                })
                setConversations([...conversations,mockConversation])
            }   
        } catch (error) {
            showToast("Error",error,"error")
        } finally{
            setSeach("")
        }
    }

  return (
    <Box 
    
    p={4}
    >
        <Flex gap={4} flexDirection={"row"} maxW={{base:"100%",md:"full"}} mx={"auto"}>
            <Flex flex={30} gap={2} flexDirection={"column"}
                maxW={{sm:"250",md:"full"}}
                mx={"auto"}
            > 
                <Text fontWeight={700} color={useColorModeValue("gray.600","gray.400")}>
                    Your Conversation
                </Text>
                <form onSubmit={handleConversationSearch}>
                    <Flex alignItems={"center"} gap={2}>
                        <Input placeholder='Search for a user'
                        value={search}
                        onChange={(e)=>setSeach(e.target.value)}
                        />
                        <Button size={"sm"} type='submit'>
                            <SearchIcon/>
                        </Button>
                    </Flex>
                </form>
                {loading && [0,1,2,3,4,5].map((_,i)=>(
                    <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                        <Box>
                            <SkeletonCircle size={10}/>
                        </Box>
                        <Flex w={"full"} flexDirection={"column"} gap={3}>
                            <Skeleton h={"10px"} w={"80px"}/>
                            <Skeleton h={"8px"} w={"90%"}/>
                        </Flex>
                    </Flex>
                ))}
                {
                    !loading && conversations.map((conversation)=>(
                        <Conversation conversation={conversation} key={conversation._id}
                        isOnline={onlineUsers.includes(conversation.participants[0]?._id)}
                        />
                    ))
                }

            </Flex>
            {!selectedConversation && (<Flex flex={70} borderRadius={"md"} p={2} flexDirection={"column"} align={"center"} justifyContent={"center"} height={"400px"}>
                <GiConversation size={100}/>
                <Text fontSize={20} textAlign={"center"}>Search name's user you want to talk <br/> to create a conversation</Text>
            </Flex>)}
            {selectedConversation && (
                <MessageContainer/>
            )}
        </Flex>
    </Box>
  )
}

export default ChatPage