const mongoose = require("mongoose");
const SkinSchema = new mongoose.Schema({
  name: String,
  price: Number,
  float: Number,
  imageUrl: String,
});
module.exports = mongoose.model("Skin", SkinSchema);
