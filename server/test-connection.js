import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI);

const connectToMongoDB = async () => {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4, // Force IPv4
      serverSelectionTimeoutMS: 30000, // 30 second timeout
      connectTimeoutMS: 30000,
    });
    console.log('✅ MongoDB connected successfully!');
    
    // Test a simple operation
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Test document inserted successfully!');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

connectToMongoDB();
