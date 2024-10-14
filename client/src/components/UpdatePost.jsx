import { Avatar, Button, Flex, FormControl, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { BsFillImageFill } from 'react-icons/bs'
import useGetPicture from '../hooks/useGetPicture'
import useShowToast from '../hooks/useShowToast'
import { useNavigate } from 'react-router-dom'

const UpdatePost = ({isOpen,onClose,post}) => {
    
    const user= useRecoilValue(userAtom)
    const MAX_CONTENT_LENGTH=200
    const {handlePicChange,picURL,setPicURL}= useGetPicture()
    const [loading,setLoading]= useState(false)
    const [inputContent,setInputContent]= useState(post?.content)
    const [inputContentRemain,setInputContentRemain]= useState(post?.content?MAX_CONTENT_LENGTH-post.content.length:MAX_CONTENT_LENGTH)
    const imageInputRef=useRef(null)
    const showToast= useShowToast()
    const navigate= useNavigate()
    const handleInputContentChange=(e)=>{
        if(e.target.value.length>MAX_CONTENT_LENGTH){
            setInputContent(e.target.value.slice(0,MAX_CONTENT_LENGTH))
        }else{
            setInputContent(e.target.value)
            setInputContentRemain(MAX_CONTENT_LENGTH-e.target.value.length)
        }
    }
    const handleUpdatePost=async()=>{
        setLoading(true)
        try {
            const res= await fetch(`/api/post/update/${post._id}`,{
                method:'PATCH',
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
            showToast('Success','Post updated successfully','success')
            navigate(`/user/${user.username}`)
            }
        catch (error) {
            showToast('Error',error,'error')
        }
        finally{
            onClose()
            setInputContent(post?.content)
            setInputContentRemain(post?.content?MAX_CONTENT_LENGTH-post.content.length:MAX_CONTENT_LENGTH)
            setPicURL(null)
            setLoading(false)
        }
    }
  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        
           
            <ModalContent borderRadius={"xl"} bg={useColorModeValue("white","gray.dark")}>
            <ModalHeader textAlign={"center"}>Update Post</ModalHeader>
            <ModalBody>
                <Flex align={"center"}>
                <Avatar src={user?.profilePicture}/>
                <Text ml={3} fontWeight={"bold"} color={useColorModeValue("black","white")}>{user?.username}</Text>
                </Flex>
                <FormControl mt={2}>
                    <Textarea value={inputContent} onChange={handleInputContentChange}></Textarea>
                    <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.light"}>
                        {inputContentRemain}/{MAX_CONTENT_LENGTH}
                    </Text>
                    <Input type ="file" hidden ref={imageInputRef} onChange={handlePicChange}/>
                  {post?.img &&(  <BsFillImageFill style={{marginLeft:"5px",cursor:"pointer"}}
                    size={16}
                    onClick={()=>imageInputRef.current.click()}
                    />)}
                </FormControl>
                {(picURL || post?.img) &&(
                <Flex mt={5} w={"fit-content"} position={"relative"}>
                <Image src={picURL|| post?.img} alt='Post Picture' h={"460"} borderRadius={"lg"}/>
                </Flex>
                )}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' onClick={handleUpdatePost} isLoading={loading}>
                    Update
                </Button>
            </ModalFooter>
            </ModalContent>
       
    </Modal>
    </>
  )
}

export default UpdatePost