import express from "express";
import {
  getUserInventory,
  addInventoryItem,
  listItemForSale,
  updateListingPrice,
  unlistItem,
  markItemSold,
  getMarketplace
} from "../controllers/InventoryController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/marketplace", getMarketplace);

// Protected routes (require authentication)
router.use(authenticate);

// User inventory routes
router.get("/", getUserInventory);
router.post("/", addInventoryItem);
router.put("/:id/list", listItemForSale);
router.put("/:id", updateListingPrice);
router.delete("/:id/unlist", unlistItem);

// Admin only routes
router.put("/:id/sold", markItemSold);

export default router;
