import { Avatar, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Stack, Textarea, useColorModeValue } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useGetPicture from '../hooks/useGetPicture'
import useShowToast from '../hooks/useShowToast'
import {useNavigate} from 'react-router-dom'
const UpdateProfilePage = () => {
    const MAX_LENGTH=30
    const {handlePicChange,picURL}= useGetPicture()
    const [user,setUser]= useRecoilState(userAtom)
    const [loading, setLoading]= useState(false)
    const [input,setInput]= useState({
        name:user.name,
        username:user.username,
        email:user.email,
        description:user.description,
        password:''
    })
    const pictureFileRef= useRef(null)
    const showToast= useShowToast()
    const navigate= useNavigate()
    const handleInputChange=(e)=>{
        if(e.target.value.length>MAX_LENGTH){
            setInput({...input,[e.target.name]:e.target.value.slice(0,MAX_LENGTH)})
        }else{
            setInput({...input,[e.target.name]:e.target.value})
        }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        if(loading) return 
        try {
            const res= await fetch('/api/user/update',{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({...input,profilePicture:picURL})
            })
            const data= await res.json()
            if(data.error){
                showToast('Error',data.error,'error')
                return
            }
            showToast('Success','Profile Updated','success')
            setUser(data)
            localStorage.setItem('user',JSON.stringify(data))
            navigate(`/user/${data.username}`)
        } catch (error) {
            showToast('Error',error,'error')
        } finally{
            setLoading(false)
        }
    }


  return (
    <form onSubmit={handleSubmit}>
        <Flex align={'center'} justify={"center"} my={6}>
            <Stack spacing={4} w={'full'} maxW={'md'} bg={useColorModeValue('white','gray.dark')}
            rounded={'xl'} boxShadow={'lg'} p={6}>
                <Heading lineHeight={1.1} fontSize={{base:'2xl', sm:'3xl'}}>
                    User Profile Edit
                </Heading>
                <FormControl>
                    <Stack direction={['column','row']} spacing={6}>
                        <Center>
                            <Avatar size={"xl"} boxShadow={"md"} src={picURL ||user.profilePicture}/>
                        </Center>
                        <Center w={"full"}>
                            <Button w={"full"} onClick={()=>pictureFileRef.current.click()}>Change Avatar</Button>
                            <Input type={"file"} display={"none"} ref={pictureFileRef} onChange={handlePicChange}/>
                        </Center>
                    </Stack>
                </FormControl>
                <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input placeholder='Your Name' type='text'
                    _placeholder={{color:'gray.500'}}
                    value={input.name}
                    name='name'
                    onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input placeholder='Your Username' type='text'
                    _placeholder={{color:'gray.500'}}
                    value={input.username}
                    name='username'
                    onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder='Your Email' type='email'
                    _placeholder={{color:'gray.500'}}
                    value={input.email}
                    name='email'
                    onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea placeholder='Your Desciption' type='text'
                    _placeholder={{color:'gray.500'}}
                    value={input.description}
                    onChange={(e)=>setInput({...input,description:e.target.value})}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input placeholder='Your Password' type='password'
                     _placeholder={{color:'gray.500'}}
                     value={input.password}
                        onChange={(e)=>setInput({...input,password:e.target.value})}
                     />
                </FormControl>
                <Stack spacing={6} direction={['column','row']}>
                    <Button bg={'red.400'}
                        color={'white'}
                        w={'full'}
                        _hover={{
                            bg:'red.500'
                        }}
                        type='button'
                        onClick={()=>navigate(`/user/${user.username}`)}
                    >
                        Cancel
                    </Button>
                    <Button bg={'green.400'}
                        color={'white'}
                        w={'full'}
                        _hover={{
                            bg:'green.500'
                        }}
                        type='submit'
                        isLoading={loading}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    </form>
  )
}

export default UpdateProfilePage