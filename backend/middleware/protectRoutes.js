// Import necessary modules
import jwt from 'jsonwebtoken'
import User from '../models/user.Model.js';
// const User = require('../models/user.Model.js'); // Adjust the path as needed

// Middleware function to protect routes
const protectRoute = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies?.jwt;

        // Check if token is present
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token not provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is valid
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Find the user based on the user ID from the token
        const user = await User.findById(decoded.userId).select("-password");

        // Attach the user information to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default protectRoute;
