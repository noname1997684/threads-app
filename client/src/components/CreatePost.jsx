import { Avatar, Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import { BsFillImageFill } from 'react-icons/bs'
import useGetPicture from '../hooks/useGetPicture'
import useShowToast from '../hooks/useShowToast'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import userAtom from '../atoms/userAtom'
import { useNavigate } from 'react-router-dom'
const CreatePost = ({isOpen,onClose}) => {
  const MAX_CONTENT_LENGTH=200
  const {handlePicChange,picURL,setPicURL}= useGetPicture()
  const [loading,setLoading]= useState(false)
  const [inputContent,setInputContent]= useState('')
  const [inputContentRemain,setInputContentRemain]= useState(MAX_CONTENT_LENGTH)
  const imageInputRef=useRef(null)
  const showToast= useShowToast()
  const setPosts= useSetRecoilState(postsAtom)
  const user= useRecoilValue(userAtom)
  const navigate= useNavigate()
  const handleInputContentChange=(e)=>{

    if(e.target.value.length>MAX_CONTENT_LENGTH){
      setInputContent(e.target.value.slice(0,MAX_CONTENT_LENGTH))
    }else{
      setInputContent(e.target.value)
      setInputContentRemain(MAX_CONTENT_LENGTH-e.target.value.length)
    }
  }

  const handleCreatePost=async()=>{
    setLoading(true)
    try {
      const res= await fetch('/api/post/create',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          content:inputContent,
          picURL
        })
      })
      const data= await res.json()
      if(data.error){
        showToast('Error',data.error,'error')
      }
      showToast('Success','Post created successfully','success')
      setPosts((prevPosts)=>[data,...prevPosts])
      navigate(`/${user.username}/post/${data._id}`)
    } catch (error) {
      showToast('Error',error,'error')
    }finally{
      onClose()
      setInputContent('')
      setInputContentRemain(MAX_CONTENT_LENGTH)
      setPicURL(null)
      setLoading(false)
    }
  }
  return (
    <>
    
    <Modal isOpen={isOpen} onClose={onClose} isCentered >
      <ModalOverlay/>
      <ModalContent borderRadius={"xl"} bg={useColorModeValue("white","gray.dark")}>
        <ModalHeader textAlign={"center"}>Create Post</ModalHeader>
        <ModalBody>
          <Flex align={"center"}>
            <Avatar src={user?.profilePicture}/>
            <Text ml={3} fontWeight={"bold"} color={useColorModeValue("black","white")}>{user?.username}</Text>
          </Flex>
          <FormControl mt={2}>
            <Textarea type='text' placeholder='Post content' value={inputContent} onChange={handleInputContentChange}/>
            <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.light"}>
              {inputContentRemain}/{MAX_CONTENT_LENGTH}
            </Text>
            <Input type='file' hidden ref={imageInputRef}
            onChange={handlePicChange}
            />
            <BsFillImageFill
            style={{marginLeft:'5px',cursor:'pointer'}}
            size={16}
            onClick={()=>imageInputRef.current.click()}
            />
          </FormControl>
          {picURL && (
            <Flex mt={5} w={"fit-content"} position={"relative"}>
            <Image src={picURL} alt='Post Picture' h={"460"} borderRadius={"lg"}/>
            <CloseButton onClick={()=>setPicURL(null)}
            bg={"gray.800"}
            color={"white"}
            position={"absolute"}
            top={2}
            right={2}  
            borderRadius={"full"}
            opacity={0.6}
            />
            </Flex>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' onClick={handleCreatePost} isLoading={loading}>
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    </>
  )
}

export default CreatePost