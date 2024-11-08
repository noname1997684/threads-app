import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ViewIcon,ViewOffIcon} from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import  {authScreenAtom}  from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'
const LoginCard = () => {
    const [input,setInput]= useState({
        username:'',
        password:''
    })
    const setUser= useSetRecoilState(userAtom)
    const showToast= useShowToast()
    const setAuthScreen= useSetRecoilState(authScreenAtom)
    const [showPassword, setShowPassword] = useState(false)
    
    const handleLogin= async()=>{
        try {
           const res= await fetch('/api/user/login',{
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
   <Flex
   align={"center"}
   justify={"center"}
   >
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
                Login
            </Heading>
        </Stack>
    <Box
    rounded={'lg'}
    bg={useColorModeValue('white','gray.dark')}
    boxShadow={'lg'}
    p={8}
    w={{
        sm:"400px",
        base:"full"
    }}
    >
        <Stack spacing={4}>
            <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input type='text' 
                value={input.username}
                onChange={(e)=>setInput({...input,username:e.target.value})}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={showPassword ? 'text':'password'}
                    value={input.password}
                    onChange={(e)=>setInput({...input,password:e.target.value})}
                    />
                    <InputRightElement h={'full'}>
                    <Button variant={'ghost'}
                    onClick={()=>setShowPassword(!showPassword)}
                    >
                        {showPassword ? <ViewIcon/> :<ViewOffIcon/>}
                    </Button>
                    </InputRightElement>
                </InputGroup>
                
            </FormControl>
            <Stack spacing={10} pt={2}>
                <Button
                size="lg"
              
                onClick={handleLogin}
                >
                   Login 
                </Button>
            </Stack>
            <Stack pt={6}>
                <Text align={'center'}>
                    Don't have an account ? &nbsp;
                    <Link color={"blue.400"} onClick={()=>setAuthScreen('signup')}>
                    Sign Up
                    </Link>
                </Text>
            </Stack>
        </Stack>
    </Box>
    </Stack>
   </Flex>
  )
}

export default LoginCard