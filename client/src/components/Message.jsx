import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
import {selectedConversationAtom} from '../atoms/messagesAtom'
import { BsCheck2All } from 'react-icons/bs'
const Message = ({message}) => {
    const user= useRecoilValue(userAtom)
    const selectedConversation= useRecoilValue(selectedConversationAtom)
    const userMessage= user._id === message.sender
    const [loading,setLoading]=useState(true)
  return (
    <>
        {userMessage ?(
            <>
            
            
                {message.text &&(
                    <Flex alignSelf={"flex-end"} gap={1}>
                    <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"} >
                        <Text color={"white"}>
                            {message.text}
                        </Text>
                        <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400":""} fontWeight={"bold"}>
                            <BsCheck2All size={16}/>

                        </Box>
                        
                    </Flex> 
                    <Avatar src={user.profilePicture} w={7} h={7}/>
                    </Flex>
                )}
               
               
                {message.img && loading &&(
                    <Flex mt={5} w={"200px"} alignSelf={"flex-end"}>
                        <Image src={message.img} hidden onLoad={()=>setLoading(false)}/>
                        <Skeleton w={"200px"} h={"200px"}/>
                    </Flex>
                )}
                {message.img && !loading &&(
                    <Flex alignSelf={"flex-end"} gap={1}>
                    <Flex mt={5} w={"200px"} alignSelf={"flex-end"}>
                        <Image src={message.img} alt='Message image' borderRadius={4}/>
                        <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400":""} fontWeight={"bold"}>
                            <BsCheck2All size={16}/>

                        </Box>
                        
                    </Flex>
                    <Avatar src={user.profilePicture} w={7} h={7} mt={4}/>
                    </Flex>
                )}
            </>
        ):(
            <>
                
                {message.text &&(
                    <Flex gap={1}>
                    <Avatar src={selectedConversation.userProfilePicture} w={7} h={7}/>
                    <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
                        {message.text}
                    </Text>
                    </Flex>
                )}
                {message.img &&(
                    <Flex mt={5} w={"200px"} gap={1}>
                        <Avatar src={selectedConversation.userProfilePicture} w={7} h={7}/>
                        <Image src={message.img} alt='Message image' borderRadius={4}/>
                        
                    </Flex>
                )}
            </>
        )}
   </>
  )
}

export default Message