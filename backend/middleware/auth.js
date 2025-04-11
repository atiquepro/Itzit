import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token Authorized" });
    }
    const token = authHeader.split(" ")[1];  // Extract token


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.id 
        next()
    }catch(error) {
        res.status(401).json({message: "Invalid Token"})
    }
}

export default authMiddleware