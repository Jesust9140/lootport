const Skin = require("../models/Skin");

const getSkins = async (req, res) => {
  try {
    const skins = await Skin.find();
    res.status(200).json(skins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addSkin = async (req, res) => {
  try {
    const newSkin = new Skin(req.body);
    const saved = await newSkin.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getSkins, addSkin };
