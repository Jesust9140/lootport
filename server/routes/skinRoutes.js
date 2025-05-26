const express = require("express");
const router = express.Router();

// Example route to fetch all skins
router.get("/", (req, res) => {
  console.log("GET /api/skins hit");
  res.json([
    { id: 1, name: "AK-47 | Redline", price: 25.0 },
    { id: 2, name: "AWP | Dragon Lore", price: 1500.0 },
  ]);
});

// Route to fetch a skin by ID
router.get("/:id", (req, res) => {
  const skins = [
    { id: 1, name: "AK-47 | Redline", price: 25.0 },
    { id: 2, name: "AWP | Dragon Lore", price: 1500.0 },
  ];

  const skinId = parseInt(req.params.id, 10);
  const skin = skins.find((s) => s.id === skinId);

  if (skin) {
    res.json(skin);
  } else {
    res.status(404).json({ message: "Skin not found" });
  }
});

console.log("GET /api/skins route defined");

module.exports = router;
