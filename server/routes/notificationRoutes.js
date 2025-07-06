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

// all notifications need auth, no public access
router.use(authenticate);

// basic user notification operations
router.get("/", getNotifications);
router.put("/:id/read", markNotificationRead);
router.put("/read-all", markAllNotificationsRead);

// TODO: add admin middleware to these routes
// also need pagination for notifications
router.post("/broadcast", broadcastNotification);
router.post("/skin-sold", notifySkinSold);

export default router;
