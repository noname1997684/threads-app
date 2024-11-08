import { Box, Flex, Input, InputGroup, InputLeftElement, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { IoSearchSharp } from "react-icons/io5";
import SuggestedUser from "../components/SuggestedUser"

import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const SuggestedUsers = ({}) => {
    const [input,setInput]= useState('')
    const [suggestUsers,setSuggestUsers]= useState([])
    const user= useRecoilValue(userAtom)
    const [loading,setLoading]= useState(true)
    const [page,setPage]= useState(1)
    const showToast= useShowToast()
    const navigate= useNavigate()
    const pathname=useLocation().pathname
    const lastUsers= useRef(null)
    const [hasMore,setHasMore]=useState(true)
    useEffect(()=>{
        setSuggestUsers([])
        window.scrollTo(0,0)
      },[pathname])
    if(user){
    useEffect(()=>{
      const fetchSuggestedUser= async()=>{
        setLoading(true)
        if(page===1){
          setSuggestUsers([])
          }
        if(input){
          setPage(1)
        }
        try {
          
          const res= await fetch(`/api/user/suggested?search=${input}&page=${page}`)
          const data= await res.json()
          if(data.error){
              showToast('Error',data.error,'error')
              return
          }
          
          if(page===1){
          setSuggestUsers(data.suggestedUsers)
          }else{
            setSuggestUsers(prev=>[...new Set([...prev,...data.suggestedUsers])])
          }
          setHasMore(data.isNext)
      } catch (error) {
          showToast('Error',error,'error')
      }finally{
          setLoading(false)
      }
      }
      fetchSuggestedUser()
    },[showToast,input,page])
  }
    const handleSearchPost= async(e)=>{
      if(e.key!=="Enter") return
      navigate(`/search?q=${input}`)
    }
    const lastUsersCallback= useCallback((node)=> {
        if(loading) return
        if(lastUsers.current) lastUsers.current.disconnect()
        lastUsers.current= new IntersectionObserver(entries=>{
          if(entries[0].isIntersecting && hasMore){
            setPage(prev=>prev+1)
            
          }
        }
      )
        if(node) lastUsers.current.observe(node)
    },[loading,hasMore])
  console.log(suggestUsers)
  return (
    <Flex p={3} flexDirection={"column"} gap={5}>
      
        <InputGroup gap={1}>
        <InputLeftElement pointerEvents={"none"} color={"gray.light"}>
            <IoSearchSharp size={20}/>
        </InputLeftElement>
        <Input type='text' borderRadius={"xl"} placeholder='Search' onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={handleSearchPost}/>
        </InputGroup>

       
        <Text mb={4} fontWeight={"bold"}>
        Suggested Users
    </Text>
    <Flex direction={"column"} gap={4}>
      {!user && <Text>Log in to see suggested users</Text>}
        {suggestUsers.map((user,index)=>
        <Box ref={suggestUsers.length===index+1?lastUsersCallback:null} key={user._id}>
        <SuggestedUser user={user} key={user._id}/>
        </Box>
        )} 
        {loading && user && [1,2,3,4,5].map((_,index)=>(
            <Flex key={index} gap={2} align={"center"} p={1} borderRadius={"md"}>
                <Box>
                    <SkeletonCircle size={"10"}/>
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={2}>
                   <Skeleton h={"8px"} w={"80px"}/> 
                   <Skeleton h={"8px"} w={"90px"}/> 
                </Flex>
                <Flex>
                    <Skeleton h={"30px"} w={"60px"}/>
                </Flex>
            </Flex>
        ))}
    </Flex>
    </Flex>
  )
}

export default SuggestedUsers