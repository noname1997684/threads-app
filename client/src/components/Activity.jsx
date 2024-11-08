import { Avatar, Box, Divider, Flex, Text } from '@chakra-ui/react'

import React from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { formatDistanceToNow } from 'date-fns'

const Activity = ({act}) => {
    
    const user= useRecoilValue(userAtom)
    
  return (
    <Flex gap={3} direction={"column"}>
    <Flex gap={2} as={Link} to={`/${user?.username}/post/${act.postId}`} justifyContent={"flex-start"} alignItems={"center"}>
        <Avatar src={act?.sender.profilePicture}/>
        <Box>
            <Flex alignItems={"center"} gap={2}>
        <Text fontSize={"sm"} fontWeight={"bold"}>
            {act?.sender.username} 
        </Text>
        <Text fontSize={"sm"} w={"max-content"} color={"gray.light"}>
            {formatDistanceToNow(new Date(act?.createdAt))} ago
        </Text>
        </Flex>
        <Text>
            has {act?.type} your post
        </Text>
        </Box>
        
    </Flex>
    <Divider/>
    </Flex>
  )
}

export default Activity