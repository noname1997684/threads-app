import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import  useShowToast  from '../hooks/useShowToast'
import { useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import Activity from '../components/Activity'
import { useSocket } from '../context/SocketContext'
import { notificationAtom } from '../atoms/notificationAtom'
import { useLocation } from 'react-router-dom'
const ActivityPage = () => {
    const [loading,setLoading]= useState(true)
    const showToast= useShowToast()
    const [activity,setActivity]= useState([])
    const user= useRecoilValue(userAtom)
    const notifications= useRecoilValue(notificationAtom)
    const [page,setPage]= useState(1)
    const {socket}= useSocket()
    const lastActivity= useRef(null)
    const pathname= useLocation().pathname
    const [hasMore,setHasMore]= useState(true)
    useEffect(()=>{
        setActivity([])
        window.scrollTo(0,0)
    },[pathname])
    useEffect(()=>{

        const getActivity= async()=>{
            setLoading(true)
            try{
            const res= await fetch(`/api/post/activity/${user._id}?page=${page}`)
            const data= await res.json()
            if(data.error){
                showToast('Error',data.error,'error')
                return
            }
            if(page===1){
            setActivity(data.activity)
            }
            else{
                setActivity(prev=>[...new Set([...prev,...data.activity])])
            }
            setHasMore(data.isNext)
        }catch(error){
            showToast('Error',error,'error')

        } finally{
            setLoading(false)
        }
    }
        getActivity()
    },[showToast,user._id,page])
    useEffect(()=>{
        if(notifications){
            socket?.emit('seenNotifications',user._id)
        }
    },[socket,user.notifications,user._id])
    const lastActivityCallback= useCallback((node)=>{
        if(loading) return
        if(lastActivity.current) lastActivity.current.disconnect()
        lastActivity.current= new IntersectionObserver(entries=>{
            if(entries[0].isIntersecting && hasMore){
                setPage(prev=>prev+1)
            }
        })
        if(node) lastActivity.current.observe(node)
    },[loading])
  return (
    <Flex p={3} flexDirection={"column"} gap={5}>
    
        {!loading && activity.length===0 && <Text>No activity</Text>}
        {activity.map((act,index)=>(
            <Box key={act._id} ref={activity.length===index+1?lastActivityCallback:null}>
                <Activity act={act} key={act._id}/>
            </Box>
        ))}
        {loading && [1,2,3,4,5].map((_,index)=>(
            <Flex key={index} gap={2} align={"center"} p={1} borderRadius={"md"}>
                <Box>
                    <SkeletonCircle size={"10"}/>
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={2}>
                   <Skeleton h={"8px"} w={"120px"}/> 
                   <Skeleton h={"8px"} w={"150px"}/> 
                </Flex>
            </Flex>
        ))}
    
    </Flex>
  )
}

export default ActivityPage