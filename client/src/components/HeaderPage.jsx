import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useLocation } from 'react-router-dom'
const HeaderPage = () => {
    const {pathname}= useLocation()
  return (
    <Flex w={"100%"} alignItems={"center"} justifyContent={"center"} my={4}>
        <Text fontWeight={"bold"}>Header Page</Text>
    </Flex>
  )
}

export default HeaderPage