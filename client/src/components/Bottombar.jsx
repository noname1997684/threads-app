import { Box, Button, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import {useRecoilValue} from 'recoil'

import {Link as RouterLink, useLocation} from 'react-router-dom'
import userAtom from '../atoms/userAtom'

import { BiHomeAlt2, BiSolidHomeAlt2 } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { TbMessageCircle2 } from "react-icons/tb";
import { AddIcon } from '@chakra-ui/icons'
import { IoSearchSharp,IoCreateOutline } from "react-icons/io5";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import SigninModal from './SigninModal'

const Bottombar = () => {
    
  const user= useRecoilValue(userAtom)
  const {onOpen}= useDisclosure()
  const [modalTitle,setModalTitle]= useState("")
  const {onOpen:onOpenModal,isOpen:isOpenModal, onClose:onCloseModal}= useDisclosure()
  const pathname= useLocation().pathname
  
  return (
    <Flex align={"center"} justifyContent={"center"} gap={5} position={"fixed"} bottom={0} bg={useColorModeValue("gray.100","black")} w={"100%"} display={{base:"flex",md:"none"}} zIndex={50} py={4} >
          
        <Button as={RouterLink} to="/" rounded={"xl"} py={6}  color={pathname==="/"?useColorModeValue("black","white"):"gray.light"} variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
        {pathname==="/"? <BiSolidHomeAlt2 size={28}/>:<BiHomeAlt2 size={28}/> }
        </Button>
        <Button as={RouterLink} to="/search" rounded={"xl"} py={6}  color={pathname==="/search"?useColorModeValue("black","white"):"gray.light"} variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
        <IoSearchSharp size={28}/>
        </Button>
       {user ?( <Button  rounded={"xl"} py={6} color={"gray.light"} onClick={onOpen} bg={useColorModeValue("gray.200","gray.dark")} _hover={{color:useColorModeValue("black","white")}}>
         <AddIcon boxSize={6}/>
          </Button>):(<Button  rounded={"xl"} py={6}  color={pathname==="/search"?useColorModeValue("black","white"):"gray.light"} variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}} 
          onClick={()=>{
            setModalTitle("Sign in to create post")
            onOpenModal()
          }}
          _active={{transform: 'scale(0.9)'}}
          >
         <IoCreateOutline size={28}/>
          </Button>)}
          {user ?(<Button as={RouterLink} to={'/activity'} py={6}  rounded={"xl"}  color={pathname==="/activity"?useColorModeValue("black","white"):"gray.light"}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
          {pathname==="/activity"? <FaHeart size={24}/>:<FaRegHeart size={24}/> }
          </Button>):(<Button  rounded={"xl"} py={6}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}} color={"gray.light"}
            onClick={()=>{
              setModalTitle("Sign in to view activity")
              onOpenModal()
            }}
            _active={{transform: 'scale(0.9)'}}
            >
            <FaRegHeart size={24}/>
          </Button>)}
       
       {user && <Button as={RouterLink} to={'/chat'} py={6}  rounded={"xl"}  color={pathname==="/chat"?useColorModeValue("black","white"):"gray.light"}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
         {pathname==="/chat"? <TbMessageCircle2Filled size={24}/>:<TbMessageCircle2 size={24}/> }
          </Button>}
       
          {user ? (<Button as={RouterLink} to={`/user/${user.username}`} color={pathname===`/user/${user.username}`?useColorModeValue("black","white"):"gray.light"}   rounded={"xl"} py={6}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}}>
            {pathname===`/user/${user.username}`?<FaUser size={24}/>:<FaRegUser size={24}/>}
          </Button>):(
            <Button  rounded={"xl"} py={6}  variant='ghost' _hover={{bg:useColorModeValue("gray.200","gray.dark")}} color={"gray.light"}
            onClick={()=>{
              setModalTitle("Sign in to view user profile")
              onOpenModal()
            }}
            _active={{transform: 'scale(0.9)'}}
            >
            <FaRegUser size={24}/>
          </Button>

          )}
          
          <SigninModal onCloseModal={onCloseModal} isOpenModal={isOpenModal} modalTitle={modalTitle}/>
    </Flex>
  )
}

export default Bottombar