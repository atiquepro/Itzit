import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";
import authRoutes from "./routes/auth.js"
import googleAuthRoutes from './googleAuth.js'

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend Vite URL
    credentials: true, // Allow cookies for session
  })
);
app.use(express.json());

app.use(passport.initialize());

app.use("/api/auth", googleAuthRoutes); // Make sure this is after passport/session setup


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/auth/google-login", (req, res) => {
  res.json({ message: "Google Login API is working" }); // Return JSON
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
