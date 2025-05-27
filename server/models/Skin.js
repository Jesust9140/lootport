import mongoose from "mongoose";

const skinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  suggestedPrice: { type: Number },
  imageUrl: { type: String, required: true },
  rarity: { type: String, required: true },
  wear: { type: String, required: true },
  category: { type: String, required: true },
});

const seedSkins = async () => {
  const skins = [
    {
      name: "AK-47 | Redline",
      price: 42.5,
      suggestedPrice: 55.0,
      imageUrl: "https://example.com/ak47-redline.png",
      rarity: "Classified",
      wear: "Field-Tested",
      category: "rifles",
    },
    {
      name: "AWP | Dragon Lore",
      price: 1500.0,
      suggestedPrice: 1800.0,
      imageUrl: "https://example.com/awp-dragon-lore.png",
      rarity: "Covert",
      wear: "Minimal Wear",
      category: "rifles",
    },
  ];

  try {
    await Skin.insertMany(skins);
    console.log("Skins seeded successfully!");
  } catch (error) {
    console.error("Error seeding skins:", error);
  }
};

const Skin = mongoose.model("Skin", skinSchema); // Ensure this is declared only once

seedSkins();

export default Skin;
