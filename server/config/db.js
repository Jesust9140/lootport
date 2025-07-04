import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Log the connection attempt
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGO_URI ? "***configured***" : "***NOT SET***");
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10 // Maintain up to 10 socket connections
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 DNS lookup failed. Check your internet connection and MongoDB URI.');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Check your username and password.');
    } else if (error.message.includes('IP whitelist')) {
      console.error('🚫 IP not whitelisted. Add your IP to MongoDB Atlas whitelist.');
    } else if (error.message.includes('ServerSelectionTimeoutError')) {
      console.error('⏰ Connection timeout. MongoDB cluster might be paused or unreachable.');
    }
    
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check MongoDB Atlas cluster status');
    console.error('   2. Verify IP whitelist in Network Access');
    console.error('   3. Ensure cluster is not paused');
    console.error('   4. Check username/password in connection string');
    
    process.exit(1);
  }
};

export default connectDB;
