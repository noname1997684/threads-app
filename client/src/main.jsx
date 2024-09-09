import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import {RecoilRoot} from 'recoil'
import { ChakraProvider,ColorModeScript,extendTheme } from '@chakra-ui/react'
import {mode} from '@chakra-ui/theme-tools'
import { SocketContextProvider } from './context/SocketContext'
const styles={
    global:(props)=>({
        body:{
            color:mode('gray.800','whiteAlpha.900')(props),
            bg:mode('gray.100','#000000')(props)
        }
    })
}
const config={
    initialColorMode:'dark',
    useSystemColorMode:true
}

const colors={
    gray:{
        light:'#616161',
        dark:'#1e1e1e'
    }
}

const theme= extendTheme({styles,config,colors})
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
        <RecoilRoot>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
        <SocketContextProvider>
        <App/>
        </SocketContextProvider>
       
        </ChakraProvider>
        </RecoilRoot>
        </BrowserRouter>
    </React.StrictMode>
)