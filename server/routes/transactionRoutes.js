import express from "express";
import {
  createTransaction,
  completeTransaction,
  getUserTransactions,
  cancelTransaction
} from "../controllers/TransactionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

// Transaction routes
router.post("/", createTransaction);
router.get("/", getUserTransactions);
router.put("/:id/complete", completeTransaction);
router.put("/:id/cancel", cancelTransaction);

export default router;
