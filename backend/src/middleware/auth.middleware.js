import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => {
    try {
        //get token
        const token = req.headers.authorization?.replace("Bearer ", "");
        console.log("Token from header >>> ", token);

        if (!token) {
            return res.status(401).json({ message: "No authentication token, access denied" });
        }   
         // verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(verified.userId);
        if (!user) {
            console.log("User not found for token, Token is invalid, access denied >>> ", token);
            return res.status(401).json({ message: "User not found, Token is invalid, access denied" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        return res.status(401).json({ message: "Invalid token, access denied" });
    }
};

export default protectRoute;