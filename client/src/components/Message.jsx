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
            <Flex gap={2} alignSelf={"flex-end"}>
            
                {message.text &&(
                    
                    <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                        <Text color={"white"}>
                            {message.text}
                        </Text>
                        <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400":""} fontWeight={"bold"}>
                            <BsCheck2All size={16}/>

                        </Box>
                    </Flex> 
                   
                
                )}
               
                {message.img && loading &&(
                    <Flex mt={5} w={"200px"}>
                        <Image src={message.img} hidden onLoad={()=>setLoading(false)}/>
                        <Skeleton w={"200px"} h={"200px"}/>
                    </Flex>
                )}
                {message.img && !loading &&(
                    <Flex mt={5} w={"200px"}>
                        <Image src={message.img} alt='Message image' borderRadius={4}/>
                        <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400":""} fontWeight={"bold"}>
                            <BsCheck2All size={16}/>

                        </Box>
                    </Flex>
                )}
                <Avatar src={user.profilePicture} w={7} h={7}/>
            </Flex>
        ):(
            <Flex gap={2}>
                <Avatar src={selectedConversation.userProfilePicture} w={7} h={7}/>
                {message.text &&(
                    <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
                        {message.text}
                    </Text>
                )}
                {message.img &&(
                    <Flex mt={5} w={"200px"}>
                        <Image src={message.img} alt='Message image' borderRadius={4}/>
                        
                    </Flex>
                )}
            </Flex>
        )}
   </>
  )
}

export default Message