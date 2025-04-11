import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const AdminAuth = async(req, res, next) =>{
    const token = req.header('Authorization')
    if(!token) return res.status(401).json({message: "No Token, Authorization Denied"})

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)

        if(user.role !== 'admin'){
            return res.status(401).json({message: "Access Denied, Admins Only"})
        }
        req.user = user
        next()
    }catch(error) {
        return res.status(401).json({message: "Invalid Token"})
    }
}

export default AdminAuth