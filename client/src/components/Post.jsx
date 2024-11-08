import { Avatar, Box, Divider, Flex,  Image,Text, useDisclosure} from '@chakra-ui/react'
import {Link ,useLocation,useNavigate} from 'react-router-dom'
import UpdatePost from '../components/UpdatePost'

import {formatDistanceToNow} from 'date-fns'
import Icons from './Icons'

import useGetCreator from '../hooks/useGetCreator'

import MenuPost from './MenuPost'
const Post = ({post,isReply}) => {
    
    const {isOpen,onOpen,onClose}= useDisclosure()
    const creator= useGetCreator(post?.postedBy)
    const navigate= useNavigate()
    const pathname= useLocation().pathname
  return (
    <Link to={`/${creator?.username}/post/${post?._id}`}>
        <Flex gap={3}  py={5}>
            <Flex flexDirection={'column'} align={"center"}>
                <Avatar size={"md"} name={creator?.username} src={creator?.profilePicture}
                    onClick={(e)=>{
                        e.preventDefault()
                        navigate(`/user/${creator?.username}`)
                    }}
                />
                {pathname.includes('replies') && !isReply && <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>}
              </Flex> 
            
            <Flex flex={1} flexDirection={"column"} gap={1} >
                    <Flex justify={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"} gap={2}>
                            <Text fontSize={"sm"} fontWeight={"bold"}
                            onClick={(e)=>{
                                e.preventDefault()
                                navigate(`/user/${creator?.username}`)
                            }}
                            >
                                {creator?.username}
                            </Text>
                            <Text fontSize={"sm"} w={"max-content"} color={"gray.light"}>
                                {formatDistanceToNow(new Date(post?.createdAt))} ago
                            </Text>
                           
                        </Flex> 
                        
                       <MenuPost post={post} creator={creator} updateOpen={onOpen}/>
                    </Flex>
                    {post.content && <Text fontSize={"md"} maxW={"500"}>{post.content}</Text>}
                   
                    
                    
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} w={"300px"}>
                            <Image src={post.img} w={"full"} h={"full"}/>
                        </Box>
                    )}
                   
                    <Flex gap={3} my={1}>
                        <Icons post={post} isReply={isReply}/>
                    </Flex>
            </Flex>
        </Flex>
        {pathname.includes('replies') && isReply && <Divider/>}
        <UpdatePost isOpen={isOpen} onClose={onClose} post={post}/>
    </Link>
  )
}

export default Post