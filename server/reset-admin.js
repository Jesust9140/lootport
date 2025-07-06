import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "jesust9140@gmail.com";
    const password = "Mz203319140!";
    
    // Delete existing user
    await User.deleteOne({ email: email.toLowerCase() });
    console.log("🗑️ Deleted existing admin user");
    
    // Create new user (let the pre-save hook handle hashing)
    const newUser = await User.create({
      username: "admin",
      email: email.toLowerCase(),
      password: password, // Don't hash manually - let the model do it
      role: "admin",
      isEmailVerified: true
    });

    console.log("✅ Admin user reset successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👑 Role: ${newUser.role}`);
    
    // Test the password immediately
    const testUser = await User.findOne({ email: email.toLowerCase() });
    const isPasswordValid = await testUser.comparePassword(password);
    console.log(`🧪 Password test: ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);

  } catch (error) {
    console.error("❌ Error resetting admin user:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

resetAdmin();
