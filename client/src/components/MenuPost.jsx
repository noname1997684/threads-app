import { Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import useDeletePost from '../hooks/useDeletePost'
import { MdMoreHoriz } from "react-icons/md";
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
const MenuPost = ({post}) => {
    const user= useRecoilValue(userAtom)
    const {onOpen,isOpen,onClose}=useDisclosure()
    const handleDeletePost= useDeletePost()
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
                                    <MenuItem bg={"transparent"} _hover={{bg:useColorModeValue("gray.100","black")}} borderRadius={"lg"} p={3} icon={<DeleteIcon/>} onClick={()=>handleDeletePost(post._id)}>
                                        Delete
                                    </MenuItem>)}
                                </MenuList>
                            </Menu>
                            
                        </Flex>
  )
}

export default MenuPost