import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// @desc    Login user (admin and customers)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Set role based on email (admin for jesust9140@gmail.com, customer for others)
    const newRole = email.toLowerCase() === "jesust9140@gmail.com" ? 'admin' : 'customer';
    if (user.role !== newRole) {
      user.role = newRole;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        joinDate: user.joinDate,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Register user (customers can register for notifications)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Determine role based on email
    const role = email.toLowerCase() === "jesust9140@gmail.com" ? 'admin' : 'customer';

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      username,
      role,
    });

    // Generate token
    const token = generateToken(user._id);

    // Add welcome notification for customers
    if (role === 'customer') {
      await user.addNotification(
        "Welcome to Lootdrop!",
        "Thank you for joining Lootdrop! You'll receive notifications about skin sales and website updates here.",
        "system"
      );
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        joinDate: user.joinDate,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile",
    });
  }
};

// @desc    Create initial admin user (one-time setup)
// @route   POST /api/auth/setup
// @access  Public
export const setupAdmin = async (req, res) => {
  try {
    // Check if admin user already exists
    const adminUser = await User.findOne({ email: "jesust9140@gmail.com" });
    if (adminUser) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists",
      });
    }

    // Create admin user with your specific email
    const newAdminUser = await User.create({
      email: "jesust9140@gmail.com",
      password: "admin123", // You should change this password after first login
      username: "Jesus T",
      role: "admin"
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: "jesust9140@gmail.com",
        password: "admin123",
        note: "Please change the password after first login"
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({
      success: false,
      message: "Error setting up admin user",
    });
  }
};
