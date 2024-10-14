import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { IoIosLink } from "react-icons/io";
import userAtom from '../atoms/userAtom'
import {BsInstagram} from 'react-icons/bs'
import {CgMoreO} from 'react-icons/cg'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import useFollowing from '../hooks/useFollowing'
import useShowToast from '../hooks/useShowToast'
const UserHeader = ({user}) => {
    const userLogin = useRecoilValue(userAtom)
    const showToast= useShowToast()
    const {following,handleFollow,loading}= useFollowing(user)
    const pathname= useLocation().pathname
    const copyURL=()=>{
        const currentURL= window.location.href
        navigator.clipboard.writeText(currentURL).then(()=>{
            showToast("Success","Link Copied","success")
        })
    }
  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    {user.name}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>{user.username}</Text>
                    <Text fontSize={"xs"} bg={"gray.drak"} color={"gray.light"} p={1} borderRadius={"full"}>threads.net</Text>
                </Flex>
            </Box>
            <Box>
                {user.profilePicture && (
                    <Avatar
                    name={user.name}
                    src={user.profilePicture}
                    size={{
                        base:"md",
                        md:"xl"
                    }}
                    />
                )}
                {!user.profilePicture && (
                    <Avatar
                    name={user.name}
                    src="https://bit.ly/broken-link"
                    size={{
                        base:"sm",
                        md:"lg"
                    }}
                    />
                )}
            </Box>
        </Flex>
        <Text>
            {user.description}
        </Text>
        {userLogin?._id === user._id &&(
            <Link as={RouterLink} to={'/update'}>
            <Button size={"sm"}>Update Profile</Button>
            </Link>
        )}
        {userLogin?._id !== user._id &&(
            <Button onClick={handleFollow} isLoading={loading}>
                {following ? 'Unfollow' : 'Follow'}
            </Button>
        )}
        <Flex w={"full"} justifyContent={"space-between"} >
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>
                    {user?.followers.length} Followers
                </Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"}>instagram.com</Link>
            </Flex>
            <Flex gap={2}>
                <Box className=''>
                    <BsInstagram size={24}/>
                </Box>
                <Box>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24}/>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={useColorModeValue("white","gray.dark")}>
                                <MenuItem bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}} borderRadius={"lg"} p={3} icon={<IoIosLink/>} onClick={copyURL}>Copy Link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </Flex>
        </Flex>
        <Flex w={"full"}>
            <Flex flex={1} borderBottom={pathname==`/user/${user.username}`?`1.5px solid  ${useColorModeValue("black","white")}`:`1px solid ${useColorModeValue("white","gray.dark")}`} color={pathname==`/user/${user.username}`?useColorModeValue("black","white"):"gray.light"} justifyContent={"center"} pb={3}>
                <Link as={RouterLink} to={`/user/${user.username}`} _hover={{ textDecoration: "none" }}>
                <Text fontWeight={"bold"}>Threads</Text>
                </Link>
            </Flex>
            <Flex flex={1} borderBottom={pathname==`/user/${user.username}/replies`?`1.5px solid  ${useColorModeValue("black","white")}`:`1px solid ${useColorModeValue("white","gray.dark")}`} color={pathname==`/user/${user.username}/replies`?useColorModeValue("black","white"):"gray.light"} justifyContent={"center"} pb={3}>
                <Link as={RouterLink} to={`/user/${user.username}/replies`} _hover={{ textDecoration: "none" }}>
                <Text fontWeight={"bold"}>Replies</Text>
                </Link>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader