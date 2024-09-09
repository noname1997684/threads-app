import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'

const checkAuthorization =async (req,res,next) => {
  try {
    const token= req.cookies.UserToken
    if(!token){
        return res.status(401).json({error:"Unauthorized"}) 
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET)
    const user= await User.findById(decoded.id)
    if(!user){
        return res.status(401).json({error:"Cannot find user"})
    }
    req.user=user
    next()
  } catch (err) {
    res.status(500).json({error:err.message})
  }
  
}

export default checkAuthorization