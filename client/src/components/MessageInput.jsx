import { Flex, Input, InputGroup, InputRightElement, Modal, ModalHeader, ModalOverlay,ModalContent, ModalCloseButton, ModalBody, useDisclosure, Image, Spinner } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { BsFillImageFill } from 'react-icons/bs'
import useShowToast from '../hooks/useShowToast'
import useGetPicture from '../hooks/useGetPicture'
import { useRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
const MessageInput = ({setMessages}) => {
const [messageText,setMessageText]= useState("")
const showToast= useShowToast()
const imageRef= useRef(null)
const {onClose}= useDisclosure()

const [loading,setLoading]= useState(false)
const {handlePicChange,picURL,setPicURL}= useGetPicture()
const [selectedConversation,setSelectedConversation]= useRecoilState(selectedConversationAtom)
const [conversations,setConversations]=useRecoilState(conversationsAtom)
 const handleSendMessage = async(e)=>{
    e.preventDefault()
    if(!messageText && !picURL) return
    if(loading) return
    setLoading(true)
    try {
        const res= await fetch("/api/message/send",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({text:messageText,recipientId:selectedConversation.userId,img:picURL})
        })
        const data= await res.json()
        if(data.error){
            showToast("Error",data.error,"error")
            return 
        }
        setMessages((prev)=>[...prev,data])

        if(selectedConversation.mock){
            const username= selectedConversation.username
            const res= await fetch('/api/message/conversations')
            const data= await res.json()
            
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
           if(data.length===0) return
           
            setConversations(data)
            const conversation= data.find((conversation)=>conversation.participants[0].username===username)
            console.log(conversation)
            setSelectedConversation({
                _id:conversation._id,
                userId:conversation.participants[0]._id,
                username:conversation.participants[0].username,
                userProfilePicture:conversation.participants[0].profilePicture
            })
        }
        setConversations((prev)=>{
            const newConversations= prev.map((conversation)=>{
                if(conversation._id===selectedConversation._id){
                    return {
                        ...conversation,
                        lastMessage:{
                            text:messageText,
                            img:data.img,
                            sender:data.sender
                        }
                    }
                }
                return conversation
            })
            return newConversations
        })
       
    } catch (error) {
        showToast("Error",error,"error")
    } finally{
        setMessageText("")
        setLoading(false)
        setPicURL(null)
    }
 }
  return (
    <Flex gap={2} alignItems={"center"}>
        <form action="" style={{flex:95}} onSubmit={handleSendMessage}>
            <InputGroup>
            <Input w={"full"} placeholder='Type a message'
            value={messageText}
            onChange={(e)=>setMessageText(e.target.value)}
            />
            <InputRightElement onClick={handleSendMessage}>
            <IoSendSharp/>
            </InputRightElement>
            </InputGroup>
        </form>
        <Flex flex={5} cursor={"pointer"}>
            <BsFillImageFill size={20} onClick={()=>imageRef.current.click()}/>
            <Input type='file' hidden ref={imageRef} onChange={handlePicChange}/>
        </Flex>
        <Modal isOpen={picURL}
        onClose={()=>{
            onClose()
            setPicURL(null)
        }}
        >
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Flex mt={5} w={"full"} alignItems={"center"} justifyContent={"center"}>
                        <Image src={picURL} h={"550px"}/>
                    </Flex>
                    <Flex justifyContent={"flex-end"} my={2}>
                        {loading?(
                            <Flex>
                                <Spinner size={"md"}/>
                            </Flex>
                        ):(
                            <IoSendSharp size={20} onClick={handleSendMessage} cursor={"pointer"}/>
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    </Flex>
  )
}

export default MessageInput