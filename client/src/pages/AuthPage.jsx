import React from 'react'
import { authScreenAtom } from '../atoms/authAtom'
import { useRecoilValue } from 'recoil'
import LoginCard from '../components/LoginCard'
import RegisterCard from '../components/RegisterCard'
import { Flex, useColorModeValue } from '@chakra-ui/react'
import userAtom from '../atoms/userAtom'
const AuthPage = () => {
  const user= useRecoilValue(userAtom)
    const authScreenState= useRecoilValue(authScreenAtom)
  return (
   <>
    {authScreenState === 'login' ? <LoginCard/> : <RegisterCard/>}
   </> 
  )
}

export default AuthPage