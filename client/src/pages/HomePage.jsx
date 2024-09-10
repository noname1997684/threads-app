import { Box, Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUsers from '../components/SuggestedUsers'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import  postsAtom  from '../atoms/postsAtom'
import Post from '../components/Post'
import userAtom from '../atoms/userAtom'
const HomePage = () => {
  const showToast= useShowToast()
  const user= useRecoilValue(userAtom)
  const [loading,setLoading]= useState(true)
  const [posts,setPosts]= useRecoilState(postsAtom)
  useEffect(()=>{
    const getFeedPosts= async()=>{
      setLoading(true)
      try {
        const res= await fetch('/api/post/feed')
        const data= await res.json()
        if(data.error){
          showToast('Error',data.error,'error')
          return
        }
        setPosts(data)
      } catch (error) {
        showToast('Error',error,'error')
      }finally{
        setLoading(false)
      }

    }
    getFeedPosts()
  },[showToast,setPosts])
  return (
    

      <Box>
        {loading &&(
          <Flex justify={"center"}>
            <Spinner size={"xl"}/>
          </Flex>
        )}
      {posts && posts.map((post)=>(
        <Post post={post} key={post._id} isReply={false}/>
      ))}
      </Box>
 
  )
}

export default HomePage