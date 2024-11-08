import { Box,Button,IconButton,Menu, MenuButton, MenuItem, MenuList, useColorMode, useColorModeValue} from '@chakra-ui/react'
import React from 'react'
import {RiMenu2Fill} from 'react-icons/ri'
import {FaMoon} from 'react-icons/fa'
import {BiSun} from 'react-icons/bi'
import {FiLogOut} from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
const MenuComp = () => {
    const {colorMode,toggleColorMode}= useColorMode()
    const logout= useLogout()
    const user= useRecoilValue(userAtom)
  return (
          
    <Box>
    <Menu >
      <MenuButton as={IconButton} icon={<RiMenu2Fill size={24}/>} />
      <MenuList bg={useColorModeValue("white","gray.dark")} border={"none"} px={2} zIndex={99}>
        <MenuItem onClick={toggleColorMode} p={4} borderRadius={"xl"} fontWeight={"bold"} bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}}>
        <Button variant={"ghost"} leftIcon={colorMode!=="dark"?<FaMoon size={24}/>:<BiSun size={24}/>} gap={2} _hover={{bg:"transparent"}}>
          {colorMode==="dark"?"Switch to Light Mode":"Switch to Dark Mode"}
          </Button>
        </MenuItem>
        <MenuItem onClick={logout} p={4} borderRadius={"xl"} fontWeight={"bold"} bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}}>
       {user ?(<Button variant={"ghost"}  rightIcon={<FiLogOut size={24}/>} width={"100%"} gap={20} _hover={{bg:"transparent"}}>
            Logout
          </Button>):(<Button as={Link} to={"/auth"} variant={"ghost"}  rightIcon={<FiLogOut size={24}/>} width={"100%"} gap={20} _hover={{bg:"transparent"}}>
            Login
          </Button>)}
        </MenuItem>
      </MenuList>
    </Menu>
    
    </Box>
  )
}

export default MenuComp