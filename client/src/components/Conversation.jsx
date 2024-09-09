import { Avatar, AvatarBadge, Box, Flex,  Stack,  Text,  useColorMode,  useColorModeValue, WrapItem } from '@chakra-ui/react'

import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {selectedConversationAtom} from '../atoms/messagesAtom'
import { BsCheck2All, BsFileImageFill } from 'react-icons/bs'
import userAtom from '../atoms/userAtom'

const Conversation = ({conversation,isOnline}) => {
   
    const user= conversation.participants[0]
    const currentUser= useRecoilValue(userAtom)
    const lastMessage= conversation.lastMessage
    
    const [selectedConversation,setSelectedConversation]= useRecoilState(selectedConversationAtom)
 
    return (
    <Flex gap={4} alignItems={"center"} p={2}
    _hover={{
        cursor:"pointer",
        bg:useColorModeValue("gray.200","gray.700"),
        color:useColorModeValue("black","white")
    }}
    borderRadius={"md"}
    onClick={
        ()=>{
            setSelectedConversation({
                _id:conversation._id,
                userId:user._id,
                username:user.username,
                userProfilePicture:user.profilePicture,
                mock:conversation.mock
            })
        }
    }
    bg={selectedConversation?._id === conversation?._id ?useColorModeValue("gray.200","gray.700"):""} 
    >
        <WrapItem>
            <Avatar size={{
                base:"xs",
                sm:"sm",
                md:"md"
            }} src={user?.profilePicture}>
                {isOnline && <AvatarBadge boxSize={4} bg="green.500"/>}
            </Avatar>
        </WrapItem>
        <Stack direction={"column"} fontSize={"sm"} gap={1}>
            <Text fontWeight={"700"}>
                {user?.username} 
            </Text>
            <Text fontSize={"sm"} display={"flex"} color={"gray.400"} alignItems={"center"} gap={1}>
               {currentUser._id === lastMessage.sender ?(
                <Box color={lastMessage.seen ? "blue.400":""}>
                    <BsCheck2All size={16}/>
                </Box>
               ):""}
                {(lastMessage.text || lastMessage.img)?(lastMessage.sender!==user?._id?"You":user.username)+": ":null}
                {lastMessage.text? (lastMessage.text.length>18 ? lastMessage.text.slice(0,18)+"...":lastMessage.text):(lastMessage.img?<BsFileImageFill size={16}/>:null)}
            </Text>
        </Stack>
    </Flex>
  )
}

export default Conversation