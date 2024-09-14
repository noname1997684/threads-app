import React from 'react'
import useShowToast from './useShowToast'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import { useNavigate } from 'react-router-dom'
import userAtom from '../atoms/userAtom'
const useDeletePost = () => {
    const user= useRecoilValue(userAtom)
    const showToast= useShowToast()
    const setPosts= useSetRecoilState(postsAtom)
    const navigate= useNavigate()
    const handleDeletePost= async(postId)=>{
        
        try {
            const res= await fetch(`/api/post/delete/${postId}`,{
                method:"DELETE",
            })
            const data= await res.json()
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            showToast("Success",data.message,"success")
            setPosts((prevPosts)=>prevPosts.filter((p)=>p._id !== postId))
            navigate(`/user/${user.username}`)
        } catch (error) {
            showToast("Error",error,"error")
        }
    }
  return handleDeletePost
}

export default useDeletePost