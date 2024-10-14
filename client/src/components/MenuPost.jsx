import { Box, Flex, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import useDeletePost from '../hooks/useDeletePost'
import { MdMoreHoriz } from "react-icons/md";
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useRecoilValue } from 'recoil';
import { IoIosLink } from "react-icons/io";
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';


const MenuPost = ({post,creator,updateOpen}) => {
    
    const user= useRecoilValue(userAtom)
    const {onOpen,isOpen,onClose}=useDisclosure()
   
    const showToast= useShowToast()
    const handleDeletePost= useDeletePost()
    const CopyURL=()=>{
        navigator.clipboard.writeText(`localhost:3001/${creator?.username}/post/${post._id}`).then(()=>{
           showToast("Success","Link Copied","success")
        })
    }
  return (
    <Flex gap={2} alignItems={"center"} mr={3} onClick={(e)=>e.preventDefault()}>
                            <Menu isOpen={isOpen} onClose={onClose}>
                                <MenuButton
                                as={IconButton}
                                icon={<MdMoreHoriz size={20}/>}
                                onClick={(e)=>{
                                    e.preventDefault()
                                    onOpen()
                                }}
                                variant={"ghost"}
                                borderRadius={"full"}
                                zIndex={1}
                                />
                                
                                <MenuList bg={useColorModeValue("white","gray.dark")} px={2}>

                                    {user?._id === post.postedBy &&(
                                    <Box>
                                    <MenuItem bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}} borderRadius={"lg"} p={3} icon={<EditIcon/>} onClick={updateOpen}>
                                        Edit
                                    </MenuItem>
                                    <MenuItem bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}} borderRadius={"lg"} p={3} icon={<DeleteIcon/>} onClick={()=>handleDeletePost(post._id)}>
                                        Delete
                                    </MenuItem>
                                    </Box>
                                )}
                                    {user?._id === post.postedBy &&(
                                        <MenuDivider/>
                                    )}
                                    <MenuItem  bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}} borderRadius={"lg"} p={3} icon={<IoIosLink/>} onClick={CopyURL} >
                                        Copy Link
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            
                        </Flex>
  )
}

export default MenuPost