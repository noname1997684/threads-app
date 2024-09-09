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
import { FaMoon } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { BiSun } from "react-icons/bi";
const Sidebar = () => {
  const logout= useLogout()
  const user= useRecoilValue(userAtom)
  const {onOpen,isOpen,onClose}= useDisclosure()
  const {colorMode,toggleColorMode}= useColorMode()
  const {pathname}= useLocation()
  const navigate= useNavigate()
  return (
    <Flex justifyContent={"space-between"} position={"fixed"} top={0} left={0}  alignItems={"center"} px={3} py={5} flexDirection={"column"} h={"100%"} maxH={"100vw"}>  
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
          
        <Button as={RouterLink} to="/" rounded={"xl"} py={6} color={pathname==="/"?useColorModeValue("black","white"):"gray.light"} variant='ghost'>
        {pathname==="/"? <BiSolidHomeAlt2 size={28}/>:<BiHomeAlt2 size={28}/> }
        </Button>
        <Button  rounded={"xl"} py={6} color={"gray.light"} onClick={onOpen} bg={useColorModeValue("gray.200","gray.800")} _hover={{color:useColorModeValue("black","white")}}>
         <AddIcon boxSize={6}/>
          </Button>
       <Button as={RouterLink} to={'/chat'}  rounded={"xl"} py={6} color={pathname==="/chat"?useColorModeValue("black","white"):"gray.light"}  variant='ghost'>
         {pathname==="/chat"? <TbMessageCircle2Filled size={24}/>:<TbMessageCircle2 size={24}/> }
          </Button>
       
          <Button as={RouterLink} to={`/user/${user.username}`} color={pathname===`/user/${user.username}`?useColorModeValue("black","white"):"gray.light"}   rounded={"xl"} py={6}  variant='ghost'>
            {pathname===`/user/${user.username}`?<FaUser size={24}/>:<FaRegUser size={24}/>}
          </Button>
          
         
        </Flex>
     
      
      </Box>
      <Box>
      <Menu>
        <MenuButton as={IconButton} icon={<RiMenu2Fill size={24}/>} />
        <MenuList bg={useColorModeValue("white","gray.dark")} border={"none"} px={2}>
          <MenuItem onClick={toggleColorMode} p={4} borderRadius={"xl"} fontWeight={"bold"} bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}}>
          <Button variant={"ghost"} leftIcon={colorMode!=="dark"?<FaMoon size={24}/>:<BiSun size={24}/>} gap={2} _hover={{bg:"transparent"}}>
            {colorMode==="dark"?"Switch to Light Mode":"Switch to Dark Mode"}
            </Button>
          </MenuItem>
          <MenuItem onClick={logout} p={4} borderRadius={"xl"} fontWeight={"bold"} bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}}>
         <Button variant={"ghost"}  rightIcon={<FiLogOut size={24}/>} width={"100%"} gap={20} _hover={{bg:"transparent"}}>
              Logout
            </Button>
          </MenuItem>
        </MenuList>
      </Menu>
      
      </Box>
      <CreatePost isOpen={isOpen} onClose={onClose}/>
    </Flex>
  )
}

export default Sidebar