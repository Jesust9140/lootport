import jwt from "jsonwebtoken";
import User from "../models/User.js";

// TODO: should add rate limiting middleware here to prevent spam requests
// also need to implement token blacklisting for logout
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    // TODO: also check for token in cookies for better UX
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Check if user still exists (in case they were deleted)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid. User not found.",
      });
    }

    // should also check if user is still active/not banned
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

// hardcoded admin check is not scalable, need proper role-based permissions
// maybe implement permissions like ['manage_users', 'view_admin_panel', etc]
export const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate the user
    await authenticate(req, res, async () => {
      // Get the user from database to check role and email
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found.",
        });
      }

      // Check if user is admin and has the specific admin email
      if (user.role !== 'admin' || user.email.toLowerCase() !== 'jesust9140@gmail.com') {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin privileges required.",
        });
      }

      req.user.role = user.role;
      req.user.email = user.email;
      next();
    });
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin verification.",
    });
  }
};
