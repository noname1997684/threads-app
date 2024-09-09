import { Box, Button, Flex, FormControl, FormLabel, Heading, HStack, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { authScreenAtom } from '../atoms/authAtom'
import {ViewIcon,ViewOffIcon} from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'
const RegisterCard = () => {
  const showToast= useShowToast()
  const setUser= useSetRecoilState(userAtom)
  const setAuthScreen= useSetRecoilState(authScreenAtom)
  const [showPassword,setShowPassword]= useState(false)
  const [input,setInput]=useState({
    name:'',
    username:'',
    email:'',
    password:''
  })
  const handleRegister= async()=>{
  try {
    const res= await fetch('/api/user/register',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(input)
    })
    const data= await res.json()
    if(data.error){
      showToast('Error',data.error,'error')
      return
    }
    localStorage.setItem('user',JSON.stringify(data))
    setUser(data)
  } catch (error) {
    showToast('Error',error,'error')
  }
  }
 
  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign Up
          </Heading>
       </Stack>
       <Box rounded={'lg'} bg={useColorModeValue('white','gray.dark')}
       boxShadow={'lg'}
       p={8}
       >
        <Stack spacing={4}>
          <HStack>
            <Box>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input type='text'
                value={input.name}
                onChange={(e)=>setInput({...input,name:e.target.value})}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input type='text'
                value={input.username}
                onChange={(e)=>setInput({...input,username:e.target.value})}
                />
              </FormControl>
            </Box>
          </HStack>
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type='email'
            value={input.email}
            onChange={(e)=>setInput({...input,email:e.target.value})}
            />
            
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input type={showPassword? 'text':'password'}
              value={input.password}
              onChange={(e)=>setInput({...input,password:e.target.value})}
            />
            <InputRightElement>
              <Button
              variant={'ghost'}
              onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? <ViewOffIcon/>:<ViewIcon/>}
              </Button>
            </InputRightElement>
            </InputGroup>
            
          </FormControl>
          <Stack spacing={10} pt={2}>
            <Button onClick={handleRegister}>
              Sign up
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
              Already a user ? &nbsp;<Link color={'blue.400'} onClick={()=>setAuthScreen('login')}>
              Login
              </Link>
            </Text>
          </Stack>
        </Stack>
       </Box>
      </Stack>
    </Flex>
  )
}

export default RegisterCard