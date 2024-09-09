import React from 'react'
import {Routes,Route,Navigate, useLocation} from 'react-router-dom'
import { Box,Button,Container, Flex,Text, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import Sidebar from './components/Sidebar'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'
import UpdateProfilePage from './pages/UpdateProfilePage'
import { useRecoilValue } from 'recoil'
import CreatePost from './components/CreatePost'
import userAtom from './atoms/userAtom'
import PostPage from './pages/PostPage'
import ChatPage from './pages/ChatPage'
import Header from './components/Header'
import HeaderPage from './components/HeaderPage'
import { AddIcon } from '@chakra-ui/icons'
const App = () => {
  const user= useRecoilValue(userAtom)
  const {onOpen,isOpen,onClose}= useDisclosure()
  const {pathname}=useLocation()
  
  return (
    <Flex position={"relative"} w={"full"} h={"100vh"} flexDir={user?"row":"column"}>
        {user ? <Sidebar/>:<Header/>}
            
            <Container maxW={pathname==="/chat"?"920px":"640px"}> 
            <HeaderPage/>
            <Flex justifyContent={"center"} flexDirection={"column"} w={"full"}  px={3} py={1} roundedTop={"3xl"} bg={user?useColorModeValue("white","gray.dark"):useColorModeValue("white","black")} mt={user?0:20}>
                <Routes>
                <Route path='/' element={ <HomePage/>}/>
                <Route path='/auth' element={!user ? <AuthPage/>:<Navigate to="/"/>}/>
                <Route path='/user/:username' element={<UserPage/>}/>
                <Route path='/update' element={<UpdateProfilePage/>}/>  
                 <Route path='/:username/post/:postId' element={<PostPage/>}/>           
                <Route path='/chat' element={user? <ChatPage/>:<Navigate to={"/auth"}/>}/>
            </Routes>
              </Flex>
            
            {user && (
              <Button
              position={"fixed"}
              bottom={10}
              right={5}
              bg={useColorMode().colorMode === 'light' ? 'gray.300' : 'gray.dark'}
              onClick={onOpen}
              size={"lg"}
              >
                  <AddIcon boxSize={6}/>
              </Button>
            )}
            <CreatePost isOpen={isOpen} onClose={onClose}/>
            </Container>
    </Flex> 
  )
}

export default App