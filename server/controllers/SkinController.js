const Skin = require("../models/Skin");

const getSkins = (req, res) => {
  res.json([
    { name: "Example Skin 1", price: 10, imageUrl: "example1.jpg" },
    { name: "Example Skin 2", price: 20, imageUrl: "example2.jpg" },
  ]);
};

const addSkin = async (req, res) => {
  try {
    const newSkin = req.body; // Mock saving to database
    res.status(201).json(newSkin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSkins, addSkin };
