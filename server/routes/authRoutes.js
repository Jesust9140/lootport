import express from "express";
import { login, register, getProfile, setupAdmin } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);
router.post("/setup", setupAdmin); // should remove this in production

// Protected routes  
// TODO: add password reset, email verification, change password routes
router.get("/profile", authenticate, getProfile);

export default router;
