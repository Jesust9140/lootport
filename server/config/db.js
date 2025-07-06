import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// TODO: I should probably add Redis caching later for better performance
// Maybe implement connection pooling metrics too
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGO_URI ? "***configured***" : "***NOT SET***");
    
    // I might need to ajust these settings for production scaling
    // Current timeout is 5s but maybe need longer for Atlas sometimes
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // might bump this to 10000 later
      maxPoolSize: 10 // probably need more connections when we get more users
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // I should add connection health monitoring here eventually
    // Maybe log when connections drop/reconnect for debugging
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      // TODO: implement auto-reconnect logic or alert system
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // I added these specific error handeling cases because I kept running into them
    // when setting up Atlas - might help future me debug faster
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 DNS lookup failed. Check your internet connection and MongoDB URI.');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Check your username and password.');
    } else if (error.message.includes('IP whitelist')) {
      console.error('🚫 IP not whitelisted. Add your IP to MongoDB Atlas whitelist.');
    } else if (error.message.includes('ServerSelectionTimeoutError')) {
      console.error('⏰ Connection timeout. MongoDB cluster might be paused or unreachable.');
    }
    
    // These troubleshooting tips saved me so much time during development
    // keeping them here incase I need to debug connection issues later
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check MongoDB Atlas cluster status');
    console.error('   2. Verify IP whitelist in Network Access');
    console.error('   3. Ensure cluster is not paused');
    console.error('   4. Check username/password in connection string');
    
    process.exit(1);
  }
};

export default connectDB;
