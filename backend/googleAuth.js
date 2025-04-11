import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from "dotenv"
import express from 'express'
import jwt from 'jsonwebtoken'
import User from './models/User.js'

dotenv.config()

const router = express.Router()

// Configure Google OAuth strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/google/callback", 
        },

        async(accessToken, refreshToken, profile, done) => {
            try{
                // Check if user exists in the database
                let user = await User.findOne({googleId: profile.id})

                if(!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value
                    })
                }
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
  
          // Attach token to user object
          user.token = token;

        return done(null, user)
            }catch(error) {
                return done(error, null)
            }
        }
        
    )
)


// Google Auth Routes
router.get(
    "/google-login",
    passport.authenticate("google", {scope: ["profile", "email"], prompt: "select_account", session: false})
)

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    async (req, res) => {
      const user = req.user;  // User returned by passport after authentication
      const token = jwt.sign(
        { id: user._id },  // Payload to identify the user
        process.env.JWT_SECRET,  // Secret key to sign the token
        { expiresIn: "1h" }  // Expiry time
      );
      // Send JWT as response
      res.redirect(`http://localhost:5173/login?token=${token}`);
    }
  );
  

export default router