import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from './useShowToast'
import { useNavigate } from 'react-router-dom'
import {selectedConversationAtom} from '../atoms/messagesAtom'
const useLogout = () => {
    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()
    const navigate= useNavigate()
    const setSelectedConversationAtom= useSetRecoilState(selectedConversationAtom)
    const logout= async()=>{
    try {
        const res= await fetch('/api/user/logout',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
        })
        const data= await res.json()
        if(data.error){
            showToast("Error",data.error, 'error')
            return
        }
        localStorage.removeItem('user')
        setUser(null)
        setSelectedConversationAtom(null)
        navigate('/auth')
    } catch (error) {
        showToast("Error",error, 'error')
    }
}
    return logout
}

export default useLogout