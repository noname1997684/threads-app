import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import SuggestedUser from './SuggestedUser'

const SuggestedUsers = () => {
    const [suggestUsers,setSuggestUsers]= useState([])
    const [loading,setLoading]= useState(true)
    const showToast= useShowToast()
    useEffect(()=>{
        const getSuggestedUsers= async ()=>{
        try {
            const res= await fetch('/api/user/suggested')
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
    getSuggestedUsers()
    },[showToast])
  return (
    <>
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
    </>
  )
}

export default SuggestedUsers