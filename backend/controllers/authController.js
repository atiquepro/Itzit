import crypto from 'crypto'
import User from '../models/User.js'
import sendEmail from '../utils/sendEmail.js' 

const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if(!user) return res.status(404).json({message: 'User not found'})
    
        const token = crypto.randomBytes(32).toString('hex')
        user.resetPassword = token
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()

        const resetUrl = `http://localhost:5173/reset-password/${token}`
        await sendEmail(
            user.email,
            'Password reset link',
            `Click this link to reset your password: ${resetUrl}`
        )
        res.status(200).json({message: 'Reset Link Sent!'})
}

export const resetPassword = async(req, res) => {
    const { token, password } = req.body
    try{
        const user = await User.findOne({
            resetPassword: token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if(!user){
            return res.status(400).json({message: "Invalid token"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetPassword = undefined
        user.resetPasswordExpires = undefined

        await user.save()
        res.status(200).json({message: "Password has beddn reset successfully"})
    }catch (error) {
        console.error("Reset Password error: ", error)
        res.status(500).json({message: "Error Resetting Password"})
    }
}

export default forgotPassword