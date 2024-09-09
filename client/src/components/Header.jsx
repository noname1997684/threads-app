import { Box, Button, Flex, Image, Link ,Text, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import {Link as RouterLink} from 'react-router-dom'
import React, { useState } from 'react'
import { BiHomeAlt2 } from 'react-icons/bi'
import { FaRegUser } from 'react-icons/fa6'
import { AddIcon } from '@chakra-ui/icons'
import { IoCreateOutline } from "react-icons/io5"
import { BiSolidHomeAlt2 } from "react-icons/bi";
import { useLocation } from 'react-router-dom'
import { IoIosArrowForward } from "react-icons/io";
import SigninModal from './SigninModal'
const Header = () => {
  const [modalTitle,setModalTitle]= useState("")
  const {colorMode}= useColorMode()
  console.log(colorMode)
  const {pathname}= useLocation()
  const {onOpen:onOpenModal,isOpen:isOpenModal, onClose:onCloseModal}= useDisclosure()
  return (
    <Flex justifyContent={"space-between"} mb={12} w={"80%"} alignSelf={"center"} align={"center"} position={"fixed"} top={0} bg={useColorModeValue("white","black")} zIndex={50} width={"100%"} px={20}>
        <Link as={RouterLink} to={"/"} _active={{transform: 'scale(0.9)'}}>
        <Image cursor={"pointer"}
        alt='logo'
        w={9}
        src={colorMode==="dark"?'/light-logo.svg':'/dark-logo.svg'}
        />
        
        </Link>
        <Flex alignItems={"center"} >
        <Button as={RouterLink} to={"/"} bg={"transparent"} size={"lg"} p={10} color={pathname==="/"?useColorModeValue("black","white"):"gray.light"} _active={{transform: 'scale(0.9)'}}>
          {pathname==="/"? <BiSolidHomeAlt2 size={28}/>:<BiHomeAlt2 size={28}/> }
         
        </Button>
        <Button bg={"transparent"} size={"lg"} p={10} color={"gray.light"}
        onClick={()=>{
          setModalTitle("Sign in to create post")
          onOpenModal()
        }}
        _active={{transform: 'scale(0.9)'}}
        >
          <IoCreateOutline size={28}/>
        </Button>
        <Button bg={"transparent"} size={"lg"} p={10} color={"gray.light"} onClick={()=>{
          setModalTitle("Sign in to see your profile")
          onOpenModal()
        }

        }
        _active={{transform: 'scale(0.9)'}}
        >
            <FaRegUser size={28}/>
          </Button>
        </Flex>
        <Button as={RouterLink} to={'/auth'} bg={useColorModeValue("black","white")} color={useColorModeValue("white","gray.dark")} _hover={{bg:"gray.light"}}  _active={{transform: 'scale(0.9)'}}>
          <Text>Log In</Text>
        </Button>
        <SigninModal onCloseModal={onCloseModal} isOpenModal={isOpenModal} modalTitle={modalTitle}/>
    </Flex>
  )
}

export default Header