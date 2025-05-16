const Skin = require("../models/Skin");

const getSkins = async (req, res) => {
  try {
    const skins = await Skin.find();
    res.status(200).json(skins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSkin = async (req, res) => {
  try {
    const newSkin = new Skin(req.body);
    const savedSkin = await newSkin.save();
    res.status(201).json(savedSkin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSkins, addSkin };
