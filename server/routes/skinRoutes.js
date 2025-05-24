const express = require("express");
const router = express.Router();

// Example route to fetch skins
router.get("/", (req, res) => {
  console.log("GET /api/skins hit");
  res.json([
    { id: 1, name: "AK-47 | Redline", price: 25.0 },
    { id: 2, name: "AWP | Dragon Lore", price: 1500.0 },
  ]);
});
console.log("GET /api/skins route defined");

module.exports = router;
