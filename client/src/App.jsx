import React, { useEffect } from 'react'
import {Routes,Route,Navigate, useLocation} from 'react-router-dom'
import { Box,Button,Container, Flex,Text, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import Sidebar from './components/Sidebar'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'
import UpdateProfilePage from './pages/UpdateProfilePage'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import CreatePost from './components/CreatePost'
import userAtom from './atoms/userAtom'
import PostPage from './pages/PostPage'
import ChatPage from './pages/ChatPage'
import Header from './components/Header'
import HeaderPage from './components/HeaderPage'
import { AddIcon } from '@chakra-ui/icons'
import Bottombar from './components/Bottombar'
import SearchPage from './pages/SearchPage'
import ActivityPage from './pages/ActivityPage'
import { notificationAtom } from './atoms/notificationAtom'
import useShowToast from './hooks/useShowToast'

const App = () => {
  const user= useRecoilValue(userAtom)
  const {onOpen,isOpen,onClose}= useDisclosure()
  const {pathname}=useLocation()
  const setNotifications= useSetRecoilState(notificationAtom)
  const showToast=useShowToast()
  
  useEffect(()=>{
    const getNotification= async()=>{
      try {
        console.log("hello")
        const res=await fetch(`/api/user/profile/${user._id}`)
                const data= await res.json()
                if(data.error){
                    showToast("Error",data.error,"error")
                    return
                }
                setNotifications(data.notifications)
      } catch (error) {
        showToast("Error",error,"error")
      }
    }
    if(user){getNotification()}
  },[showToast,user,setNotifications])

  return (
    <Flex position={"relative"} w={"full"} h={"100vh"} flexDir={user?"row":"column"}>
        {pathname!=="/auth" && (user ? <Sidebar/>:<Header/>)}
            
            <Container maxW={pathname==="/chat"?{lg:"800px",md:"560px",xl:"920px",base:"100%",}:{md:"640px",base:"100%"}} > 
            {user && <HeaderPage/>}
            <Flex justifyContent={"flex-start"} minH={"82%"} flexDirection={"column"} w={"full"}  px={3} py={3} roundedTop={"3xl"} roundedBottom={pathname=="/chat"?"3xl":""} bg={{base:useColorModeValue("gray.100","black"),md:useColorModeValue("white","gray.dark")}} mt={user?{base:20,md:0}:32}>
                <Routes>
                <Route path='/' element={ <HomePage/>}/>
                <Route path='/auth' element={!user ? <AuthPage/>:<Navigate to="/"/>}/>
                <Route path='/user/:username' element={<UserPage/>}/>
                <Route path="/user/:username/replies" element={<UserPage/>}/>
                <Route path='/update' element={<UpdateProfilePage/>}/>  
                 <Route path='/:username/post/:postId' element={<PostPage/>}/> 
                 <Route path='/activity' element={<ActivityPage/>}/>          
                <Route path='/chat' element={user? <ChatPage/>:<Navigate to={"/auth"}/>}/>
                <Route path="/search" element={<SearchPage/>}/>
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
              display={{base:"none",md:"block"}}
              >
                  <AddIcon boxSize={6}/>
              </Button>
            )}
            <CreatePost isOpen={isOpen} onClose={onClose}/>
            </Container>
            {pathname!=="/auth" && <Bottombar/>}           
    </Flex> 
  )
}

export default App