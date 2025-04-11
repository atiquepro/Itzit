import express from 'express';
import authMiddleware from '../middleware/auth.js'; // Middleware to verify token

const router = express.Router();

// A protected route for the admin dashboard
router.get("/admin-dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!", user: req.user });
});

export default router;
