import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import InventoryItem from "./models/InventoryItem.js";
import Skin from "./models/Skin.js";
import Transaction from "./models/Transaction.js";
import connectDB from "./config/db.js";

dotenv.config();

// Sample skin data for CS2
const sampleSkins = [
  {
    name: "AK-47 | Redline",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzZ2TQXJVfdhX_Qo4A3gNiI_68NxUpG3-eo7LgW-5NuaZrIrM9pFSMCCXaKGZFz86R1pg6hYKZaJ8Xm5jVK8vDgIDEq6rGgMzrHVpPI11I2rpHw/512fx384f",
    price: 45.50,
    condition: "Field-Tested",
    rarity: "Classified"
  },
  {
    name: "AWP | Dragon Lore",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-MeKyPDM_TQfJVfdhWPAoywW4CHZ_7cNqQdr4_Ls7Jg2ytdaXMOF_Y4tJGcfSXPOAYgGo7Eox16gIeZOB9nnoiAe_uGhYWxDo5CtQlOLVoOFtwJHbpCM-hCBEhrHWsA/512fx384f",
    price: 2450.00,
    condition: "Field-Tested",
    rarity: "Contraband"
  },
  {
    name: "M4A4 | Howl",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz52YOLkDzRyTQn_VvdlWPAo-A3oADI_8MhgQoj_-eQ5Kw3g5NzHO7UrZItKTsOBDaDVYlv06Upqg6FYKMCOpSy-jAW_u2wPDkTsqzsNzLbXs7c7wMe6KXRo4x7I/512fx384f",
    price: 895.75,
    condition: "Factory New",
    rarity: "Contraband"
  },
  {
    name: "Glock-18 | Water Elemental",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz58OOy2OwhkZzvEAKMYBfAF4A3oNio37MNqUZLkpreHIgyrsoyTZuEqOYlLHpODWqKGYA2s7Eox16gILJWJ8X3oig7sv2xYUkXtqTwDy7fQpOM10I2Dp3po1SAHh7GLX8d4EHZZPw/512fx384f",
    price: 12.30,
    condition: "Minimal Wear",
    rarity: "Restricted"
  },
  {
    name: "Karambit | Doppler",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5wOuqzNQhscxbDDKJXSMo75TuAWyY_18JiRJO0-LQ5JA2xs9TBYOEscohMGcWFXqOEZwz1vgwxgqYLKMaO8n--nV3nvWgMCBW_5m0Nz7-Bo-QiyZSTv3IxyQ6TIh8/512fx384f",
    price: 567.89,
    condition: "Factory New",
    rarity: "Covert"
  },
  {
    name: "P250 | Sand Dune",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5rZrblDz9-TQXJVfdSXfgHvhW1Wi4-7cNqQdr4-L9mfQu35dfGZuIrZY5IGsfTU_LQNV3zuEQxhPUIe8CL8n_q3Ve7uDsOX0Xj8m9VnLTVpeVojZTWpCMgYnI42A/512fx384f",
    price: 0.04,
    condition: "Battle-Scarred",
    rarity: "Consumer Grade"
  },
  {
    name: "USP-S | Kill Confirmed",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5uJ_OKIz5rdwrBBLJhVOwF5BfgACA6_PhvVcWx8vVQU1a54YrOYrUpNIweS8GDCKPVZAz57Usw0vUOesCL8iq73wK_uzgJXhG8qjkExbPUpeVthpnYpmss0g_xpSNosm8/512fx384f",
    price: 89.45,
    condition: "Minimal Wear",
    rarity: "Classified"
  },
  {
    name: "Five-SeveN | Case Hardened",
    image: "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz59O_W0OwhmfzvEAKAhBvAB9xG0Wy407cNkVdL49PlXcFyz5tXCMLF5ZdlKSpWFXaPVYVv0vBk8gKJefJOJ8nvngQ64uzlbDxC7_jhRm7GHprIkwg/512fx384f",
    price: 23.67,
    condition: "Well-Worn",
    rarity: "Mil-Spec"
  }
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await User.deleteMany({});
    await InventoryItem.deleteMany({});
    await Skin.deleteMany({});
    await Transaction.deleteMany({});
    
    // Create test users
    console.log("👥 Creating test users...");
    const users = await User.create([
      {
        email: "john@lootdrop.com",
        username: "john_trader",
        password: "password123",
        role: "customer",
        bio: "Avid CS2 trader and collector",
        location: "New York, USA"
      },
      {
        email: "sarah@lootdrop.com",
        username: "sarah_collector",
        password: "password123",
        role: "customer",
        bio: "Love collecting rare skins!",
        location: "London, UK"
      },
      {
        email: "admin@lootdrop.com",
        username: "admin",
        password: "admin123",
        role: "admin",
        bio: "Lootdrop Administrator",
        location: "San Francisco, USA"
      },
      {
        email: "mike@lootdrop.com",
        username: "mike_sniper",
        password: "password123",
        role: "customer",
        bio: "AWP enthusiast",
        location: "Berlin, Germany"
      }
    ]);
    
    console.log(`✅ Created ${users.length} users`);
    
    // Create marketplace skins
    console.log("🎯 Creating marketplace skins...");
    await Skin.create(sampleSkins);
    console.log(`✅ Created ${sampleSkins.length} marketplace skins`);
    
    // Create inventory items for users
    console.log("🎒 Creating inventory items...");
    const inventoryItems = [];
    
    // John's inventory (seller)
    inventoryItems.push(
      {
        owner: users[0]._id,
        steamId: "76561198123456789_1",
        itemName: "AK-47",
        skinName: "Redline",
        rarity: "Classified",
        wear: "Field-Tested",
        floatValue: 0.25,
        imageUrl: sampleSkins[0].image,
        steamMarketPrice: 45.50,
        listingPrice: 43.00,
        status: "listed",
        listedAt: new Date(),
        inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198123456789A123456789D1234567890"
      },
      {
        owner: users[0]._id,
        steamId: "76561198123456789_2",
        itemName: "Glock-18",
        skinName: "Water Elemental",
        rarity: "Restricted",
        wear: "Minimal Wear",
        floatValue: 0.12,
        imageUrl: sampleSkins[3].image,
        steamMarketPrice: 12.30,
        listingPrice: 11.50,
        status: "listed",
        listedAt: new Date()
      },
      {
        owner: users[0]._id,
        steamId: "76561198123456789_3",
        itemName: "P250",
        skinName: "Sand Dune",
        rarity: "Consumer Grade",
        wear: "Battle-Scarred",
        floatValue: 0.78,
        imageUrl: sampleSkins[5].image,
        steamMarketPrice: 0.04,
        status: "in_inventory"
      }
    );
    
    // Sarah's inventory
    inventoryItems.push(
      {
        owner: users[1]._id,
        steamId: "76561198987654321_1",
        itemName: "AWP",
        skinName: "Dragon Lore",
        rarity: "Contraband",
        wear: "Field-Tested",
        floatValue: 0.18,
        imageUrl: sampleSkins[1].image,
        steamMarketPrice: 2450.00,
        listingPrice: 2399.99,
        status: "listed",
        listedAt: new Date()
      },
      {
        owner: users[1]._id,
        steamId: "76561198987654321_2",
        itemName: "USP-S",
        skinName: "Kill Confirmed",
        rarity: "Classified",
        wear: "Minimal Wear",
        floatValue: 0.08,
        imageUrl: sampleSkins[6].image,
        steamMarketPrice: 89.45,
        status: "in_inventory"
      }
    );
    
    // Mike's inventory
    inventoryItems.push(
      {
        owner: users[3]._id,
        steamId: "76561198555666777_1",
        itemName: "Karambit",
        skinName: "Doppler",
        rarity: "Covert",
        wear: "Factory New",
        floatValue: 0.02,
        imageUrl: sampleSkins[4].image,
        steamMarketPrice: 567.89,
        listingPrice: 550.00,
        status: "listed",
        listedAt: new Date()
      },
      {
        owner: users[3]._id,
        steamId: "76561198555666777_2",
        itemName: "M4A4",
        skinName: "Howl",
        rarity: "Contraband",
        wear: "Factory New",
        floatValue: 0.03,
        imageUrl: sampleSkins[2].image,
        steamMarketPrice: 895.75,
        status: "in_inventory"
      }
    );
    
    const createdItems = await InventoryItem.create(inventoryItems);
    console.log(`✅ Created ${createdItems.length} inventory items`);
    
    // Create sample transactions
    console.log("💰 Creating sample transactions...");
    const transactions = await Transaction.create([
      {
        buyer: users[1]._id, // Sarah
        seller: users[0]._id, // John
        inventoryItem: createdItems[1]._id, // Glock Water Elemental
        itemName: "Glock-18 | Water Elemental",
        itemImage: sampleSkins[3].image,
        salePrice: 11.50,
        platformFee: 1.15, // 10% platform fee
        sellerReceives: 10.35, // salePrice - platformFee
        condition: "Minimal Wear",
        rarity: "Restricted",
        status: "completed",
        paymentMethod: "steam_wallet",
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      },
      {
        buyer: users[3]._id, // Mike
        seller: users[1]._id, // Sarah
        inventoryItem: createdItems[4]._id, // USP Kill Confirmed
        itemName: "USP-S | Kill Confirmed",
        itemImage: sampleSkins[6].image,
        salePrice: 89.45,
        platformFee: 8.95, // 10% platform fee
        sellerReceives: 80.50, // salePrice - platformFee
        condition: "Minimal Wear",
        rarity: "Classified",
        status: "pending",
        paymentMethod: "steam_wallet"
      }
    ]);
    
    console.log(`✅ Created ${transactions.length} transactions`);
    
    // Add some notifications
    console.log("🔔 Adding notifications...");
    await users[0].addNotification(
      "Item Listed Successfully",
      "Your AK-47 | Redline has been listed for $43.00",
      "sale"
    );
    
    await users[1].addNotification(
      "Welcome to Lootdrop!",
      "Start trading your CS2 skins today",
      "system"
    );
    
    await users[3].addNotification(
      "Purchase Pending",
      "Your purchase of USP-S | Kill Confirmed is being processed",
      "sale"
    );
    
    console.log("✅ Added notifications");
    
    // Print summary
    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🎯 Marketplace Skins: ${sampleSkins.length}`);
    console.log(`   🎒 Inventory Items: ${createdItems.length}`);
    console.log(`   💰 Transactions: ${transactions.length}`);
    
    console.log("\n🔑 Test User Credentials:");
    console.log("   Customer: john@lootdrop.com / password123");
    console.log("   Customer: sarah@lootdrop.com / password123");
    console.log("   Customer: mike@lootdrop.com / password123");
    console.log("   Admin: admin@lootdrop.com / admin123");
    
    console.log("\n📋 What's Available:");
    console.log("   • Multiple users with inventories");
    console.log("   • Listed items in marketplace");
    console.log("   • Completed and pending transactions");
    console.log("   • Various skin rarities and conditions");
    console.log("   • User notifications");
    
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();
