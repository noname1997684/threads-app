import jwt from 'jsonwebtoken';

export const generateCookiesAndToken = (userId,res) => {
    const token= jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })

    res.cookie('UserToken',token,{
        httpOnly:true,
        maxAge: 15*24*60*60*1000,
        sameSite:"strict"
    })
    return token
}

export default generateCookiesAndToken