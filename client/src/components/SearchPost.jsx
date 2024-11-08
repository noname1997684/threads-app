import React, { useCallback, useEffect, useRef, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import postsAtom from '../atoms/postsAtom'
import { useRecoilState } from 'recoil'
import { useSearchParams } from 'react-router-dom'

import { Flex, Spinner } from '@chakra-ui/react'
import Post from './Post'

const SearchPost = () => {
  const [query] = useSearchParams()
  const search= query.get('q').toString()
  const [page,setPage]= useState(1)
  const [hasMore,setHasMore]= useState(true)
  const showToast= useShowToast()
  const [posts,setPosts]= useRecoilState(postsAtom)
  const [loading,setLoading]= useState(true)
  const lastPost= useRef(null)
  if(!search) return
  
 useEffect(()=>{
    const fetchSearchPost= async()=>{
    setLoading(true)
    if(page===1){
    setPosts([])
    }
      try {
        const res= await fetch(`/api/post/search?search=${search}&page=${page}`)
        const data= await res.json()
        if(data.error){
            showToast('Error',data.error,'error')
            return
        }
        if(page===1){
        setPosts(data.posts)
        }
        else{
            setPosts(prev=>[...new Set([...prev,...data.posts])])
        }
        setHasMore(data.isNext)
    } catch (error) {
        showToast('Error',error,'error')
    } finally{
        setLoading(false)
    }
    }
    fetchSearchPost()
 },[search,page,showToast,setPosts])
 const lastPostCallback= useCallback((node)=>{
    if(loading) return
    if(lastPost.current) lastPost.current.disconnect()
      lastPost.current= new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting && hasMore){
            setPage(prev=>prev+1)
        }
      })
      if(node) lastPost.current.observe(node)
 },[loading,hasMore])
  return (
    <>
      
      {posts && posts.map((post,index)=>(
       <Flex w={"100%"} flexDirection={"column"} ref={posts.length===index+1?lastPostCallback:null} key={post._id}>
        <Post post={post} key={post._id} isReply={false}/>
        </Flex>
      ))}
      {loading &&(<Spinner size={"xl"} alignSelf={"center"} />)}
    </>
  )
}

export default SearchPost