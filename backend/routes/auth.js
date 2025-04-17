import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import AdminAuth from "../middleware/AdminAuth.js"
import authMiddleware from "../middleware/auth.js"
import forgotPassword from "../controllers/authController.js"
import { resetPassword } from "../controllers/authController.js"

const router = express.Router()

//signup route

router.post("/signup", async(req, res) => {
    const {name, email, password, role, secretKey} = req.body

    try{
        //check if user exists
        const existingUser = await User.findOne({ email })
        if(existingUser) return res.status(400).json({ message: "User Already Exists" })

        // Only allow admin role if secret key matches
        let userRole = "user"
        if(role === "admin" && secretKey === process.env.ADMIN_SECRET){
            userRole = "admin"
        }

        // Save user (password will be hashed automatically via schema middleware)
        const newUser = new User({name, email, password, role: userRole})
        await newUser.save()

        res.status(201).json({message: "User Created Successfully", user: newUser})
        
    }catch (error){
        console.log(error);
        res.status(500).json({message: "Error Signing Up", error})
    }
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "User Not Found!"})

        //compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message: "Invaild Credentials"})

        //generate JWT token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        //generate refresh token
        const refreshToken = jwt.sign({id: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"})

        res.status(200).json({message: "Login Successful", token, refreshToken, user})


    }catch (error){
        res.status(500).json({message: "Error Logging In", error: error.message})

    }
})

router.post("/forgot-password", forgotPassword);
router.post('/reset-password', resetPassword);

//Refresh Token Route
router.post('/refresh-token', async(req, res) => {
    const {refreshToken} = req.body
    if(!refreshToken) return res.status(400).json({message: "Refresh Token Required"})
    
    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(decoded.id)

        if(!user){
            return res.status(401).json({message: "Invalid refresh token"})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        res.status(200).json({token})

    }catch(error) {
        res.status(401).json({message: "Invalid Refresh Token"})
    }
})

router.get("/protected", authMiddleware, (req, res) => {
    res.json({message: "This is a protected route"})
})

router.post("/logout", (req, res) => {
    res.clearCookie('token',{ httpOnly: true, secure: process.env.NODE_ENV === 'production'})
    res.status(200).json({message: "Successfully Logged Out"})
})


router.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      res.status(200).json({ user });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });


export default router