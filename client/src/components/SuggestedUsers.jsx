import { Box, Flex, Input, InputGroup, InputLeftElement, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { IoSearchSharp } from "react-icons/io5";
import SuggestedUser from "../components/SuggestedUser"

import { useNavigate } from 'react-router-dom';

const SuggestedUsers = ({}) => {
    const [input,setInput]= useState('')
    const [suggestUsers,setSuggestUsers]= useState([])
    const [loading,setLoading]= useState(true)
    const showToast= useShowToast()
    const navigate= useNavigate()
    
    useEffect(()=>{
      const fetchSuggestedUser= async()=>{
        setLoading(true)
        try {
          const res= await fetch(`/api/user/suggested?search=${input}`)
          const data= await res.json()
          if(data.error){
              showToast('Error',data.error,'error')
              return
          }
          
          setSuggestUsers(data)
          
      } catch (error) {
          showToast('Error',error,'error')
      }finally{
          setLoading(false)
      }
      }
      fetchSuggestedUser()
    },[showToast,input])
    
    const handleSearchPost= async(e)=>{
      if(e.key!=="Enter") return
      navigate(`/search?q=${input}`)
    }
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
        {!loading && suggestUsers.map((user)=><SuggestedUser user={user} key={user._id}/>)} 
        {loading && [1,2,3,4,5].map((_,index)=>(
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