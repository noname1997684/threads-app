import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import useGetUserProfile from '../hooks/useGetUserProfile'
import useShowToast from '../hooks/useShowToast'
import { useLocation, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import Post from '../components/Post'
const UserPage = () => {
    const {user,loading} =useGetUserProfile()
    const showToast= useShowToast()
    const [posts,setPosts]= useRecoilState(postsAtom)
    const [loadingUserPosts,setLoadingUserPosts]= useState(true)
    const {username} = useParams()
    const pathname= useLocation().pathname
        useEffect(()=>{
            const getRepliesPost= async()=>{
                setLoadingUserPosts(true)
                try {
                    const res= await fetch(`/api/post/replies/${username}`)
                    const data= await res.json()
                    if(data.error){
                        showToast("Error",data.error,"error")
                    }
                    setPosts(data)
                } catch (error) {
                    showToast("Error",error,"error")
                } finally{
                    setLoadingUserPosts(false)
                }
            }
        const getUserPosts= async()=>{
            setLoadingUserPosts(true)
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
        if(pathname.includes("replies")){
            getRepliesPost()
        }else{
        getUserPosts()
    }
    
    },[showToast,setPosts,username,pathname])
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
            <Flex flexDirection={'column'}>
            <Post key={post?._id} post={post} isReply={false}/>
            
            {pathname.includes("replies") && post?.replies[0]?.createdAt && <Post post={post?.replies[0]} isReply={true} key={post?.replies[0]?._id}/>}
            </Flex>
        ))}
    </>
  )
}

export default UserPage