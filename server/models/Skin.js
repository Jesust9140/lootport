import mongoose from "mongoose";

const skinSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  condition: String,
  rarity: String,
});

const Skin = mongoose.model("Skin", skinSchema);
export default Skin;
