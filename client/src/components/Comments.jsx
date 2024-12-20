import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Comments = ({reply,lastReply}) => {
  return (
    <>
    <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.profilePicture} size={"sm"} name={reply.username}/>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} maxW={"200px"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                    {reply.username}
                </Text>
                
            </Flex>
            <Text >{reply.text}</Text>
        </Flex>

    </Flex>
    {!lastReply && (<Divider/>)}
    </>
  )
}

export default Comments