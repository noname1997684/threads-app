import { Box, Button, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import {useRecoilState, useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
import useShowToast from '../hooks/useShowToast';
import postAtom from '../atoms/postAtom';

import SigninModal from './SigninModal';
import { useNavigate, useParams } from 'react-router-dom';
import useGetCreator from '../hooks/useGetCreator';
const Icons = ({post,isReply}) => {
  const user= useRecoilValue(userAtom)
  const [currentPost,setCurrentPost]= useRecoilState(postAtom)
  console.log(currentPost)
  const [liked,setLiked]= useState(post?.likes.includes(user?._id))
  console.log(liked,post?.likes.includes(user?._id))
  
  const [posts,setPosts]= useRecoilState(postsAtom)
  const [text,setText]= useState('')
  const {onClose:onCloseComment,onOpen:onOpenComment,isOpen:isOpenComment}= useDisclosure()
  const {onOpen:onOpenModal,isOpen:isOpenModal, onClose:onCloseModal}= useDisclosure()
  const showToast = useShowToast()
  const [loading,setLoading]= useState(false)
  const [modalTitle,setModalTitle]= useState("")
  const navigate= useNavigate()
  const creator= useGetCreator(post.postedBy)
  
  const handleLike= async()=>{

    if(!user) return showToast("Error","You need to sign in to like the post","error")


    try {
      const res= await fetch(`/api/post/like/${post._id}`,{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json'
          }
      })
      const data= await res.json()
      if(data.error){
        showToast("Error",data.error,"error")
        return
      }
      if(liked){
       
        const newPost= {...post,likes:post.likes.filter((id)=>id!==user._id)}
        setCurrentPost(newPost)
        const newPosts= posts.map((p)=>{
          if(p._id===post._id){
            return newPost
          }
          return p
        })
        setPosts(newPosts)
      }else{
        
        const newPost= {...post,likes:[...post.likes,user._id]}
        setCurrentPost(newPost)
        const newPosts= posts.map((p)=>{
          if(p._id===post._id){
            return newPost
          }
          return p
        })
        setPosts(newPosts)
      }

      setLiked(!liked)
    } catch (error) {
      showToast("Error",error,"error")
    }
  }

  const handleComment= async()=>{
    if(!user) return showToast("Error","You need to sign in to comment on the post","error")
    if(!text) return showToast("Error","Please enter a comment","error")
    if(loading) return
    setLoading(true)
    try {
      const res= await fetch(`/api/post/comment/${post._id}`,{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({text})
      })
      const data= await res.json()
      if(data.error){
        showToast("Error",data.error,"error")
        return
      }
      const newPost= {...post,replies:[...post.replies,data]}
      setCurrentPost(newPost)
      const newPosts= posts.map((p)=>{
        if(p._id===post._id){
          return newPost
        }
        return p
      })
      setPosts(newPosts)
    } catch (error) {
      showToast("Error",error,"error")
    } finally{
      setText('')
      onClose()
      setLoading(false)
    }
  }
  const showModal=(text)=>{
    onOpenModal()
    setModalTitle(text)
  }
  return (
    <Flex flexDirection={"column"}>
        <Flex gap={1} onClick={(e)=>e.preventDefault()} align={"center"}>
          <Button rounded={"full"} px={4} py={2} onClick={user?(isReply?()=>{
            navigate(`/${creator?.username}/post/${post?._id}`)
            }:handleLike):()=>{showModal("Sign in to like post")}}>
          <Flex align={"center"} gap={1}>
            {liked?<FaHeart size={20} fill='red' color='red' />:<FaRegHeart  size={20}/>}
            <Text>{post?.likes.length}</Text>
          </Flex>
          </Button >
          <Button rounded={"full"} px={4} py={2} onClick={user?onOpenComment:()=>{showModal("Sign in to comment post")}}>
          <Flex align={"center"} gap={2}>
          <FaRegComment size={20} style={{transform:'rotateY(180deg)'}}/>
          <Text>{post?.replies.length}</Text>
        </Flex>
        </Button>
        </Flex>
        <Modal isOpen={isOpenComment} onClose={onCloseComment}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <FormControl>
                <Input placeholder='Replies'
                value={text}
                onChange={(e)=>setText(e.target.value)}
                />

              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' size={"sm"} mr={3} onClick={handleComment} isLoading={loading}>Reply</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <SigninModal isOpenModal={isOpenModal} modalTitle={modalTitle} onCloseModal={onCloseModal}/>
    </Flex>
  )
}

export default Icons