import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    const [page,setPage]=useState(1)
    const [hasMore,setHasMore]=useState(true)
    const lastPosts= useRef(null)
    useEffect(()=>{
      setPosts([])
      window.scrollTo(0,0)
      setPage(1)
    },[pathname])
        useEffect(()=>{
            const getRepliesPost= async()=>{
                setLoadingUserPosts(true)
                try {
                    const res= await fetch(`/api/post/replies/${username}?page=`+page)
                    const data= await res.json()
                    if(data.error){
                        showToast("Error",data.error,"error")
                        return 
                    }
                    if(page===1){
                        setPosts(data.posts)
                    }else{
                        setPosts(prev=>[...new Set([...prev,...data.posts])])
                    }
                    setHasMore(data.isNext)
                } catch (error) {
                    showToast("Error",error,"error")
                } finally{
                    setLoadingUserPosts(false)
                }
            }
        const getUserPosts= async()=>{
            setLoadingUserPosts(true)
            try {
                const res= await fetch(`/api/post/user/${username}?page=`+page)
                const data = await res.json()
                if(data.error){
                    showToast("Error",data.error,"error")
                    return
                }
                
                if(page===1){
                    setPosts(data.posts)
                }else{
                    setPosts(prev=>[...new Set([...prev,...data.posts])])
                }
                setHasMore(data.isNext)
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
    
    },[showToast,setPosts,username,pathname,page])
    const lastPostsCallback= useCallback((node)=> {
        if(loadingUserPosts) return
         if(lastPosts.current) lastPosts.current.disconnect()
         lastPosts.current= new IntersectionObserver(entries=>{
           if(entries[0].isIntersecting && hasMore){
             setPage(prev=>prev+1)
             
           }
         }
       )
       if(node) lastPosts.current.observe(node)
       },[loadingUserPosts,hasMore])
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
       
        {!loadingUserPosts && posts.length===0 && <Text>User has no posts</Text>}
        {
        posts.map((post,index)=>(
            <Flex flexDirection={'column'} ref={posts.length=== index+1?lastPostsCallback:null} key={post.id}>
            <Post key={post?._id} post={post} isReply={false}/>
            
            {pathname.includes("replies") && post?.replies[0]?.createdAt && <Post post={post?.replies[0]} isReply={true} key={post?.replies[0]?._id}/>}
            </Flex>
        ))}
        {loadingUserPosts && (
        <Flex justifyContent={"center"}>
            <Spinner size={"xl"}/>
        </Flex>
    )}
    </>
  )
}

export default UserPage