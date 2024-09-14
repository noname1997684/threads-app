import { Box, Button, Flex, IconButton, Image, Link, Menu, MenuButton, MenuItem, MenuList, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {authScreenAtom} from '../atoms/authAtom'
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom'
import userAtom from '../atoms/userAtom'
import {FiLogOut} from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import { BiHomeAlt2, BiSolidHomeAlt2 } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { TbMessageCircle2 } from "react-icons/tb";
import { AddIcon } from '@chakra-ui/icons'
import CreatePost from './CreatePost'
import { TbMessageCircle2Filled } from "react-icons/tb";

const Bottombar = () => {
    
  const user= useRecoilValue(userAtom)
  const {onOpen}= useDisclosure()
  
  const pathname= useLocation().pathname
  
  return (
    <Flex align={"center"} justifyContent={"center"} gap={5} position={"fixed"} bottom={0} bg={useColorModeValue("gray.100","black")} w={"100%"} display={{base:"flex",md:"none"}} zIndex={50} py={4} >
          
        <Button as={RouterLink} to="/" rounded={"xl"} py={6}  color={pathname==="/"?useColorModeValue("black","white"):"gray.light"} variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
        {pathname==="/"? <BiSolidHomeAlt2 size={28}/>:<BiHomeAlt2 size={28}/> }
        </Button>
        <Button  rounded={"xl"} py={6} color={"gray.light"} onClick={onOpen} bg={useColorModeValue("gray.200","gray.dark")} _hover={{color:useColorModeValue("black","white")}}>
         <AddIcon boxSize={6}/>
          </Button>
       <Button as={RouterLink} to={'/chat'} py={6}  rounded={"xl"}  color={pathname==="/chat"?useColorModeValue("black","white"):"gray.light"}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
         {pathname==="/chat"? <TbMessageCircle2Filled size={24}/>:<TbMessageCircle2 size={24}/> }
          </Button>
       
          {user && <Button as={RouterLink} to={`/user/${user.username}`} color={pathname===`/user/${user.username}`?useColorModeValue("black","white"):"gray.light"}   rounded={"xl"} py={6}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
            {pathname===`/user/${user.username}`?<FaUser size={24}/>:<FaRegUser size={24}/>}
          </Button>}
          
         
        </Flex>
  )
}

export default Bottombar