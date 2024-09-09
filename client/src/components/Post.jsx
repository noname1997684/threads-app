import { Avatar, Box, Divider, Flex, Image,Text } from '@chakra-ui/react'
import {Link ,useNavigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import {formatDistanceToNow} from 'date-fns'
import Icons from './Icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import postsAtom from '../atoms/postsAtom'
const Post = ({post}) => {
    const user= useRecoilValue(userAtom)
    const showToast=useShowToast()
    const [creator,setCreator]= useState(null)
    const navigate= useNavigate()
    const [posts,setPosts]= useRecoilState(postsAtom)
    useEffect(()=>{
        const getCreator= async()=>{
            try {
                const res=await fetch(`/api/user/profile/${post.postedBy}`)
                const data= await res.json()
                if(data.error){
                    showToast("Error",data.error,"error")
                    return
                }
                setCreator(data)
            } catch (error) {
                showToast("Error",error,"error")
            }
        }
        getCreator()
    },[post.postedBy,showToast])
    const handleDeletePost= async(e)=>{
        e.preventDefault()
        try {
            const res= await fetch(`/api/post/delete/${post._id}`,{
                method:"DELETE",
            })
            const data= await res.json()
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            showToast("Success",data.message,"success")
            setPosts((prevPosts)=>prevPosts.filter((p)=>p._id !== post._id))
        } catch (error) {
            showToast("Error",error,"error")
        }
    }
  return (
    <Link to={`/${creator?.username}/post/${post?._id}`}>
        <Flex gap={3}  py={5}>
            
                <Avatar size={"md"} name={creator?.username} src={creator?.profilePicture}
                    onClick={(e)=>{
                        e.preventDefault()
                        navigate(`/user/${creator?.username}`)
                    }}
                />
               
            
            <Flex flex={1} flexDirection={"column"} gap={2} >
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
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                        </Flex>
                        <Flex gap={2} alignItems={"center"}>
                           
                            {user?._id === post.postedBy &&(
                                <DeleteIcon size={20} onClick={handleDeletePost}/>
                            )}
                        </Flex>
                    </Flex>
                    {post.content && <Text fontSize={"md"}>{post.content}</Text>}
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} w={"300px"}>
                            <Image src={post.img} w={"full"} h={"full"}/>
                        </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Icons post={post}/>
                    </Flex>
            </Flex>
        </Flex>
        <Divider/>
    </Link>
  )
}

export default Post