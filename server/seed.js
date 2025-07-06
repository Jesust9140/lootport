import mongoose from "mongoose";
import dotenv from "dotenv";
import Skin from "./models/Skin.js";

dotenv.config();

const skins = [
  {
    name: "AK-47 | Redline",
    price: 42.5,
    suggestedPrice: 55.0,
    imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/class/730/302846/256x128",
    rarity: "Classified",
    wear: "Field-Tested",
    category: "Rifles",
  },
  {
    name: "AWP | Dragon Lore",
    price: 1500.0,
    suggestedPrice: 1800.0,
    imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/class/730/259167/256x128",
    rarity: "Covert",
    wear: "Minimal Wear",
    category: "Rifles",
  },
];

const seedSkins = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Clearing existing skin data...");
    await Skin.deleteMany();

    console.log("Seeding new skin data...");
    await Skin.insertMany(skins);

    console.log("✅ Skins seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed skins:", error);
    process.exit(1);
  }
};

seedSkins();
