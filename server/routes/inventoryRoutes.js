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

// marketplace should probably be public for browsing
router.get("/marketplace", getMarketplace);

// all other routes need authentication
router.use(authenticate);

// TODO: add rate limiting on inventory operations
// also need to add admin middleware for sensitive routes
router.get("/", getUserInventory);
router.get("/advanced", getAdvancedInventory);
router.get("/analytics", getInventoryAnalytics);
router.post("/", addInventoryItem); // mainly for testing
router.put("/bulk", bulkUpdateInventory);
router.put("/:id/list", listItemForSale);
router.put("/:id", updateListingPrice);
router.delete("/:id/unlist", unlistItem);

// this should have admin protection
router.put("/:id/sold", markItemSold);

export default router;
