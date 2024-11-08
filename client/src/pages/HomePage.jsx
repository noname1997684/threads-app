import { Box, Flex, Spinner } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import  postsAtom  from '../atoms/postsAtom'
import Post from '../components/Post'

import { useLocation } from 'react-router-dom'


const HomePage = () => {
  const showToast= useShowToast()
  
  const [loading,setLoading]= useState(true)
  const [posts,setPosts]= useRecoilState(postsAtom)
  const [page,setPage]= useState(1)
  const [hasMore,setHasMore]= useState(true)
  const lastPosts= useRef(null)
  const pathname=useLocation().pathname
  useEffect(()=>{
    setPosts([])
    window.scrollTo(0,0)
  },[pathname])
  useEffect(()=>{
    const getFeedPosts= async()=>{
      setLoading(true)
      try {
        const res= await fetch('/api/post/feed?page='+page)
        const data= await res.json()
        if(data.error){
          showToast('Error',data.error,'error')
          return
        }
        if(page===1){
          setPosts(data.posts)
        }else{
        setPosts(prev=>[...new Set([...prev,...data.posts])])
       
      }
      setHasMore(data.isNext)
    } catch (error) {
        showToast('Error',error,'error')
      }finally{
        setLoading(false)
      }

    }
    getFeedPosts()
  },[showToast,setPosts,page])
  const lastPostsCallback= useCallback((node)=> {
   if(loading) return
    if(lastPosts.current) lastPosts.current.disconnect()
    lastPosts.current= new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting && hasMore){
        setPage(prev=>prev+1)
        
      }
    }
  )
  if(node) lastPosts.current.observe(node)
  },[loading,hasMore])
 
  return (
    

      <Box>
       
      {posts && posts.map((post,index)=>(
        <Box ref={posts.length=== index+1?lastPostsCallback:null} key={post.id}>
        <Post key={index} post={post}/>
        </Box>
      ))} 
      {loading &&(
          <Flex justify={"center"}>
            <Spinner size={"xl"}/>
          </Flex>
        )}
      </Box>
  
  )
}

export default HomePage