import { useEffect, useState } from "react"
import useShowToast from "./useShowToast"


const useGetCreator = (userId) => {
    const [creator, setCreator] = useState(null)
    const showToast= useShowToast()
    useEffect(()=>{
        const getCreator= async()=>{
            try {
                const res=await fetch(`/api/user/profile/${userId}`)
                const data= await res.json()
                if(data.error){
                    showToast("Error",data.error,"error")
                    return
                }
                setCreator(data)
            } catch (error) {
                showToast("Error",error,"error")
            }
        }
        getCreator()
    },[userId,showToast])
  return creator
}

export default useGetCreator