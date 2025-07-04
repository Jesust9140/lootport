import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserTransactions,
  linkSteamAccount,
  uploadProfilePicture,
  changePassword,
  deleteUserAccount
} from "../controllers/UserProfileController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get("/", getUserProfile);
router.put("/", updateUserProfile);
router.get("/transactions", getUserTransactions);
router.post("/steam/link", linkSteamAccount);
router.post("/picture", uploadProfilePicture);
router.put("/change-password", changePassword);
router.delete("/delete-account", deleteUserAccount);

export default router;
