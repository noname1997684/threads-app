import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import Icons from '../components/Icons'
import useGetUserProfile  from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import postAtom  from '../atoms/postAtom'
import Comments from '../components/Comments'
const PostPage = () => {
    const {user,loading}=useGetUserProfile()
    const {postId}=useParams()
    const showToast=useShowToast()
    const [post,setPost]= useRecoilState(postAtom)
   
    useEffect(()=>{
      const getPost= async()=>{
        try{
            const res= await fetch(`/api/post/getpost/${postId}`)
            const data= await res.json()
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            setPost(data)
           
        }
        catch(error){
            showToast("Error",error,"error")
        }
      }
        getPost()  
    },[postId,showToast])
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

        </Flex>
        <Flex gap={4} align={"center"}>
            <Text fontSize={"sm"} width={"max-content"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
            </Text>
        </Flex>
    </Flex>
    <Text my={3}>{post.content}</Text>
    {post.img && (
        <Box overflow={"hidden"} border={"1px solid"}  borderRadius={6} borderColor={"gray.light"} >
            <Image src={post.img} w={"full"} height={"full"} />

        </Box>
    )}
    <Flex gap={3} my={3}>
        <Icons post={post}/>
    </Flex>
    <Divider my={4}/>
    {post.replies.map((reply)=>(
        <Comments 
        key={reply?._id}
        reply={reply}
        lastReply={reply._id === post.replies[post.replies.length-1]._id}
        />
       
    ))}
    </>
  )
}

export default PostPage