import { useEffect, useState } from 'react'
import useShowToast from './useShowToast'
import { useParams } from 'react-router-dom'
const useGetUserProfile = () => {
    const showToast = useShowToast()
    const {username}= useParams()
    const [loading,setLoading]= useState(true)
    const [user,setUser]= useState(null)
    useEffect(()=>{
        const getUserProfile= async()=>{
    try {
        const res= await fetch(`/api/user/profile/${username}`)
        const data= await res.json()
        if(data.error){
            showToast('Error',data.error,'error')
            return
        }
        
        setUser(data)
    } catch (error) {
        showToast('Error',error,'error')
    } finally{
        setLoading(false)
    }
  }
  getUserProfile()
    },[username,showToast])

    return {user,loading}
}

export default useGetUserProfile