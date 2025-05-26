const mongoose = require("mongoose");

const SkinSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  category: String, // e.g., "rifles", "pistols"
});

module.exports = mongoose.model("Skin", SkinSchema);
