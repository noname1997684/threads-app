import { useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from './useShowToast'

const useFollowing = (user) => {
    const [loading,setLoading]=useState(false)
    const [currentUser,setCurrentUser]= useRecoilState(userAtom)
    const showToast= useShowToast()
    const [following,setFollowing]= useState(user.followers.includes(currentUser?._id))
    const handleFollow= async ()=>{
        if(!currentUser){
            showToast('Error',"Please login to follow",'error')
        }
        setLoading(true)
        try {
            const res= await fetch(`/api/user/follow/${user._id}`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            const data= await res.json()
            if(data.error){
                showToast('Error',data.error,'error')
                return
            }

            if(following){
                showToast('Success','Unfollowed','success')
                user.followers= user.followers.filter(follow=>follow!==currentUser?._id)
                const newUser ={...currentUser,following:currentUser.following.filter(follow=>follow!==user._id)}
                setCurrentUser(newUser)
                
            }
            else{
                showToast('Success','Followed','success')
                user.followers.push(currentUser?._id)
                const newUser ={...currentUser,following:[...currentUser.following,user._id]}
                setCurrentUser(newUser)
            }
            setFollowing(!following)

        } catch (error) {
            showToast('Error',error,'error')
        } finally {
            setLoading(false)
        }
    }
    return {following,handleFollow,loading}
}

export default useFollowing