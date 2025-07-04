import express from "express";
import {
  connectSteamAccount,
  getSteamProfile,
  generateVerificationCode,
  verifySteamAccount,
  importSteamInventory,
  setTradeUrl
} from "../controllers/SteamController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All Steam routes require authentication
router.use(authenticate);

// Steam account management
router.post("/connect", connectSteamAccount);
router.get("/profile", getSteamProfile);

// Steam verification
router.post("/verify/generate", generateVerificationCode);
router.post("/verify", verifySteamAccount);

// Inventory management
router.post("/import-inventory", importSteamInventory);

// Trade settings
router.put("/trade-url", setTradeUrl);

export default router;
