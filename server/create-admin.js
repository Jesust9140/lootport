import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "jesust9140@gmail.com";
    const password = "Mz203319140!";
    const username = "admin";
    const role = "admin";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Admin user already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isEmailVerified: true
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${role}`);

  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
