import React, { useState } from 'react'
import useShowToast from './useShowToast'

const useGetPicture = () => {
    const [picURL,setPicURL]= useState(null)
    const showToast = useShowToast()
    const handlePicChange= async(e)=>{
        
        const file = e.target.files[0]
        if(!file || !file.type.includes('image')){
            showToast('Error','Invalid file type!','error')
            setPicURL(null)
            return
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload=()=>{
            setPicURL(reader.result)
        }
    }

  return {handlePicChange,picURL,setPicURL}
}

export default useGetPicture