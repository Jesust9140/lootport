import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('Testing native MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI);

const connectToMongoDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    family: 4
  });

  try {
    console.log('Attempting to connect with native driver...');
    await client.connect();
    console.log('✅ MongoDB connected successfully with native driver!');
    
    // Test database access
    const db = client.db('lootdrop');
    const collections = await db.listCollections().toArray();
    console.log('✅ Database accessible, collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('✅ Disconnected successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed with native driver:', error.message);
    await client.close();
    process.exit(1);
  }
};

connectToMongoDB();
