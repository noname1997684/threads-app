import { Box, Button, Flex, Image, Link ,Text, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import {Link as RouterLink} from 'react-router-dom'
import React, { useState } from 'react'
import { BiHomeAlt2 } from 'react-icons/bi'
import { FaRegHeart, FaRegUser } from 'react-icons/fa6'
import { IoCreateOutline, IoSearchSharp } from "react-icons/io5"
import { BiSolidHomeAlt2 } from "react-icons/bi";
import { useLocation } from 'react-router-dom'
import SigninModal from './SigninModal'
import MenuComp from './MenuComp'

const Header = () => {
  const [modalTitle,setModalTitle]= useState("")
  const {colorMode}= useColorMode()
 
  const {pathname}= useLocation()
  const {onOpen:onOpenModal,isOpen:isOpenModal, onClose:onCloseModal}= useDisclosure()
  return (
    <>
    <Flex justifyContent={"space-between"} mb={12} w={"80%"} alignSelf={"center"} align={"center"} position={"fixed"} top={0} bg={useColorModeValue("white","black")} zIndex={50} width={"100%"} px={20} display={{base:"none",md:"flex"}}>
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
        <Button as={RouterLink} to="/search" bg={"transparent"} size={"lg"} p={10} color={pathname==="/search"?useColorModeValue("black","white"):"gray.light"} _active={{transform: 'scale(0.9)'}}>
        <IoSearchSharp size={28}/>
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
          setModalTitle("Sign in to see activity")
          onOpenModal()
        }

        }
        _active={{transform: 'scale(0.9)'}}
        >
            <FaRegHeart size={28}/>
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
    <Flex w={"100%"} alignItems={"center"} justifyContent={"center"} py={4} position={{base:"fixed",md:"relative"}} top={0} bg={useColorModeValue("gray.100","black")} zIndex={99} display={{base:"flex",md:"none"}}>
        <Box display={{base:"block",md:"none"}}>
    <Image 
      onClick={()=>navigate('/')}
      src={colorMode==="dark"?'/light-logo.svg':'/dark-logo.svg'}
      cursor={'pointer'}
      alt={'logo'}
      w={8}
      />
      </Box>
      <Box position={"absolute"} right={5} zIndex={99} display={{base:"block",md:"none"}}>
        <MenuComp/>
      </Box>
    </Flex>
    </>
  )
}

export default Header