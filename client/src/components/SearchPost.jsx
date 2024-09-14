import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import postsAtom from '../atoms/postsAtom'
import { useRecoilState } from 'recoil'
import { useSearchParams } from 'react-router-dom'

import { Flex, Spinner } from '@chakra-ui/react'
import Post from './Post'

const SearchPost = () => {
  const [query] = useSearchParams()
  const search= query.get('q').toString()
  console.log(search)
  const showToast= useShowToast()
  const [posts,setPosts]= useRecoilState(postsAtom)
  const [loading,setLoading]= useState(true)
  if(!search) return

 useEffect(()=>{
    const fetchSearchPost= async()=>{
    setLoading(true)
      try {
        const res= await fetch(`/api/post/search?search=${search}`)
        const data= await res.json()
        if(data.error){
            showToast('Error',data.error,'error')
            return
        }
        setPosts(data)
    } catch (error) {
        showToast('Error',error,'error')
    } finally{
        setLoading(false)
    }
    }
    fetchSearchPost()
 },[search])
 
  return (
    <>
      {loading &&(<Spinner size={"xl"} alignSelf={"center"} />)}
      {posts && posts.map((post)=>(
       <Flex w={"100%"} flexDirection={"column"}>
        <Post post={post} key={post._id} isReply={false}/>
        </Flex>
      ))}
    </>
  )
}

export default SearchPost