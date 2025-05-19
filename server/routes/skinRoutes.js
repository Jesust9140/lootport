const express = require("express");
const { getSkins, addSkin } = require("../controllers/SkinController");

const router = express.Router();

// GET /api/skins
router.get("/", getSkins);

// POST /api/skins
router.post("/", addSkin);

module.exports = router;
