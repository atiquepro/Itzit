import express from 'express';
import authMiddleware from '../middleware/auth.js'; // Middleware to verify token

const router = express.Router();

// A protected route for the user dashboard
router.get("/user-dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the user dashboard!", user: req.user });
});

export default router;
