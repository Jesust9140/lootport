import express from "express";
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  broadcastNotification,
  notifySkinSold
} from "../controllers/NotificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

// Customer routes
router.get("/", getNotifications);
router.put("/:id/read", markNotificationRead);
router.put("/read-all", markAllNotificationsRead);

// Admin only routes
router.post("/broadcast", broadcastNotification);
router.post("/skin-sold", notifySkinSold);

export default router;
