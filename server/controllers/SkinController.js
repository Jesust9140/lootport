const Skin = require("../models/Skin");

// Fetch all skins from the database
const getSkins = async (req, res) => {
  try {
    const skins = await Skin.find();
    res.json(skins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new skin to the database
const addSkin = async (req, res) => {
  try {
    const skin = new Skin(req.body);
    const savedSkin = await skin.save();
    res.status(201).json(savedSkin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single skin by ID
const getSkinById = async (req, res) => {
  try {
    const skin = await Skin.findById(req.params.id);
    if (!skin) return res.status(404).json({ message: "Skin not found" });
    res.json(skin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSkins, addSkin, getSkinById };
