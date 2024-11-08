import { Box, Button, Flex, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import {useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import MenuComp from './MenuComp'
import { IoMdArrowRoundBack } from "react-icons/io";
const HeaderPage = () => {
    const pageName={
      "":"Home Page",
      "chat":"Chat Page",
      "search":"Search Page",
      "user":"User Page",
      "activity":"Activity Page",
    }
    const {colorMode}= useColorMode()
    const navigate= useNavigate()
   const [query]= useSearchParams()
    const search= query.get('q')
    let{pathname}= useLocation()
   pathname= pathname.split("/")[1]
    
  return (
    <Flex w={"100%"} alignItems={"center"} justifyContent={"center"} py={4} position={{base:"fixed",md:"relative"}} top={0} bg={useColorModeValue("gray.100","black")} zIndex={99}>
        {search && <Button onClick={()=>navigate('/search')} position={"absolute"} top={2} left={2} border={"1px solid"} borderColor={useColorModeValue("black","white")} bg={"transparent"} borderRadius={"full"} p={1}>
          <IoMdArrowRoundBack size={18}/>
          </Button>}
        <Text fontWeight={"bold"} display={{base:"none",md:"block"}}>{pageName[pathname]}</Text>
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
  )
}

export default HeaderPage