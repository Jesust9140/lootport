import mongoose from "mongoose";

// TODO: I need to expand this schema with more fields like:
// - float value, sticker details, inspect links, market trends
// - maybe add validation for CS2 skin names and rarities
const skinSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number, // I should probably use Decimal128 for precise pricing later
  condition: String,
  rarity: String,
});

const Skin = mongoose.model("Skin", skinSchema);
export default Skin;
