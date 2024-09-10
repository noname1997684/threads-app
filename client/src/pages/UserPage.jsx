import { Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import useGetUserProfile from '../hooks/useGetUserProfile'
import useShowToast from '../hooks/useShowToast'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import Post from '../components/Post'
const UserPage = () => {
    const {user,loading} =useGetUserProfile()
    const showToast= useShowToast()
    const [posts,setPosts]= useRecoilState(postsAtom)
    const [loadingUserPosts,setLoadingUserPosts]= useState(true)
    const {username} = useParams()
        useEffect(()=>{
        const getUserPosts= async()=>{
            try {
                const res= await fetch(`/api/post/user/${username}`)
                const data = await res.json()
                if(data.error){
                    showToast("Error",data.error,"error")
                }
                
                setPosts(data)
            } catch (error) {
                showToast("Error",error.message,"error")
            } finally{
                setLoadingUserPosts(false)
            }
        }
        getUserPosts()
    },[showToast,setPosts,username])
    if(loading){
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"}/>
            </Flex>
        )
    }
    if(!user&& !loading){
        return <Text>User Not Found</Text>
    }
  return (
    <>
     
        
        <UserHeader user={user}/>
       {loadingUserPosts && (
        <Flex justifyContent={"center"}>
            <Spinner size={"xl"}/>
        </Flex>
    )}
        {!loadingUserPosts && posts.length===0 && <Text>User has no posts</Text>}
        {!loadingUserPosts &&
        posts.map((post)=>(
            <Post key={post?._id} post={post} isReply={false}/>
        ))}
    </>
  )
}

export default UserPage