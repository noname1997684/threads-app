import React, { useEffect} from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Avatar, Box,  Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import Icons from '../components/Icons'
import useGetUserProfile  from '../hooks/useGetUserProfile'
import { useRecoilState,  } from 'recoil'

import Post from '../components/Post'
import postsAtom from '../atoms/postsAtom'


import MenuPost from '../components/MenuPost'
const PostPage = () => {
    const {user,loading}=useGetUserProfile()
    const [posts,setPosts]= useRecoilState(postsAtom)
    const {postId}=useParams()
    const showToast=useShowToast()
   
    
   const post=posts[0]
    useEffect(()=>{
        
      const getPost= async()=>{
        setPosts([])
        try{
            const res= await fetch(`/api/post/getpost/${postId}`)
            const data= await res.json()
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            setPosts([data])
           
        }
        catch(error){
            showToast("Error",error,"error")
        }
      }
        getPost()  
       
    },[postId,showToast,setPosts])
    
    if(loading){
        return (
            <Flex justify={"ceter"}>
                <Spinner size={"xl"}/>
            </Flex>
        )
    }
    if(!post) return null
  return (
    <>
    <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src={user?.profilePicture} size={"md"} name={user?.name}/>
            <Flex>
                <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
            </Flex>
            <Text fontSize={"sm"} width={"max-content"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
            </Text>
        </Flex>
       <MenuPost post={post}/>
    </Flex>
    <Text my={3}>{post.content}</Text>
    {post.img && (
        <Box overflow={"hidden"} border={"1px solid"} w={"fit-content"}  borderRadius={6} borderColor={"gray.light"} >
            <Image src={post.img}  height={"500"} />

        </Box>
    )}
    <Flex gap={3} my={3}>
        <Icons post={post} />
    </Flex>
    <Divider my={4}/>
    <Text fontWeight={"bold"}> Replies</Text>
    <Divider my={4}/>
    {post.replies && post.replies.map((reply)=>(
        
       <Post post={reply} isReply={true} key={reply._id}/>
    ))}
    </>
  )
}

export default PostPage