import express from "express";
import {
  getUserInventory,
  addInventoryItem,
  listItemForSale,
  updateListingPrice,
  unlistItem,
  markItemSold,
  getMarketplace,
  getAdvancedInventory,
  bulkUpdateInventory,
  getInventoryAnalytics
} from "../controllers/InventoryController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/marketplace", getMarketplace);

// Protected routes (require authentication)
router.use(authenticate);

// User inventory routes
router.get("/", getUserInventory);
router.get("/advanced", getAdvancedInventory);
router.get("/analytics", getInventoryAnalytics);
router.post("/", addInventoryItem);
router.put("/bulk", bulkUpdateInventory);
router.put("/:id/list", listItemForSale);
router.put("/:id", updateListingPrice);
router.delete("/:id/unlist", unlistItem);

// Admin only routes
router.put("/:id/sold", markItemSold);

export default router;
