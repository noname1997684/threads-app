import React from 'react'
import useFollowing from '../hooks/useFollowing'
import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import {Link} from 'react-router-dom'
const SuggestedUser = ({user}) => {
  const {handleFollow,following,loading}=useFollowing(user)
    return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
        <Flex gap={2} as={Link} to={`/user/${user.username}`}>  
            <Avatar src={user.profilePicture}/>
            <Box>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                    {user.username}
                </Text>
                <Text color={"gray.light"} fontSize={"sm"}>
                    {user.name}
                </Text>
            </Box>
        </Flex>
        <Button size={"sm"} color={following?"black":"white"}
        bg={following?"white":"blue.400"} onClick={handleFollow}
        isLoading={loading}
        _hove={{
            color:following?"black":"white",
            opacity:"0.8"
        }}
        >
            {following?"Unfollow":"Follow"}
        </Button>
    </Flex>
  )
}

export default SuggestedUser