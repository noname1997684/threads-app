import { Box, Button, Flex,  Image,  useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {useRecoilState, useRecoilValue } from 'recoil'

import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom'
import userAtom from '../atoms/userAtom'

import { BiHomeAlt2, BiSolidHomeAlt2 } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { TbMessageCircle2 } from "react-icons/tb";
import { AddIcon } from '@chakra-ui/icons'
import CreatePost from './CreatePost'
import { TbMessageCircle2Filled } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import MenuComp from './MenuComp'
import { useSocket } from '../context/SocketContext'
import { notificationAtom } from '../atoms/notificationAtom'


const Sidebar = ({userInfo}) => {
  const {socket}= useSocket()
  const user= useRecoilValue(userAtom)
  const [notifications,setNotifications]= useRecoilState(notificationAtom)
  const {onOpen,isOpen,onClose}= useDisclosure()
  const {colorMode,toggleColorMode}= useColorMode()
  const {pathname}= useLocation()
  const navigate= useNavigate()
  
  
  useEffect(()=>{
    socket?.on('newActivity',()=>{
      setNotifications(true)
    })
    socket?.on('notificationsSeen',()=>{
      setNotifications(false)
    })
  },[socket])
  return (
    <Flex justifyContent={"space-between"} position={"fixed"} top={0} left={0}  alignItems={"center"} px={3} py={5} flexDirection={"column"} h={"100%"} maxH={"100vw"} display={{base:"none",md:"flex"}}>  
    <Box>
    <Image
      onClick={()=>navigate('/')}
      src={colorMode==="dark"?'/light-logo.svg':'/dark-logo.svg'}
      cursor={'pointer'}
      alt={'logo'}
      w={8}
      />
      </Box>
      <Box>
     
      

     
      
        <Flex align={"center"} gap={5} flexDirection={"column"}>
          
        <Button as={RouterLink} to="/" rounded={"xl"} py={6} color={pathname==="/"?useColorModeValue("black","white"):"gray.light"} variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
        {pathname==="/"? <BiSolidHomeAlt2 size={28}/>:<BiHomeAlt2 size={28}/> }
        </Button>
        <Button as={RouterLink} to="/search" rounded={"xl"} py={6} color={pathname==="/search"?useColorModeValue("black","white"):"gray.light"} variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
        <IoSearchSharp size={28}/>
        </Button>
        <Button  rounded={"xl"} py={6} color={"gray.light"} onClick={onOpen} bg={useColorModeValue("gray.200","gray.dark")} _hover={{color:useColorModeValue("black","white")}}>
         <AddIcon boxSize={6}/>
          </Button>
          <Box position={"relative"}>
          <Button as={RouterLink} to={'/activity'}  rounded={"xl"} py={6} color={pathname==="/activity"?useColorModeValue("black","white"):"gray.light"}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
         {pathname==="/activity"? <FaHeart size={24}/>:<FaRegHeart size={24}/> }
          </Button>
         {notifications && <Box width={"8px"} height={"8px"} color={"red"} bgColor={"red"} borderRadius={6} position={"absolute"} top={3} right={3}></Box>}
          </Box>
       <Button as={RouterLink} to={'/chat'}  rounded={"xl"} py={6} color={pathname==="/chat"?useColorModeValue("black","white"):"gray.light"}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
         {pathname==="/chat"? <TbMessageCircle2Filled size={24}/>:<TbMessageCircle2 size={24}/> }
          </Button>
       
          <Button as={RouterLink} to={`/user/${user?.username}`} color={pathname.startsWith(`/user/${user?.username}`)?useColorModeValue("black","white"):"gray.light"}   rounded={"xl"} py={6}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
            {pathname.startsWith(`/user/${user?.username}`)?<FaUser size={24}/>:<FaRegUser size={24}/>}
          </Button>
          
         
        </Flex>
     
      
      </Box>
      <MenuComp/>
      <CreatePost isOpen={isOpen} onClose={onClose}/>
    </Flex>
  )
}

export default Sidebar