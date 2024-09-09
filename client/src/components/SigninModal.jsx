import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'

const SigninModal = ({isOpenModal,modalTitle,onCloseModal}) => {
    
  return (
    <Modal isOpen={isOpenModal} onClose={onCloseModal} isCentered>
    <ModalOverlay/>
    <ModalContent bg={useColorModeValue("white","gray.dark")} >
      <ModalHeader textAlign={"center"} >
        <Text fontSize={"xx-large"} fontWeight={"extrabold"} w={"550"}>
          {modalTitle}
        </Text>
      </ModalHeader>
      <ModalBody textAlign={"center"} color={"gray.light"}>
      Join Threads to share ideas, ask questions, post random thoughts and more.
      </ModalBody>
      <ModalFooter alignSelf={"center"}>
        <Button rightIcon={<IoIosArrowForward/>} w={"80"} py={6} bg={useColorModeValue("white","gray.dark")} border={"1px solid"} borderColor={"gray.light"}>
          Log In
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default SigninModal