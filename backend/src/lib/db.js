import dns from 'dns';
import mongoose from 'mongoose';

const fallbackDNSServers = ['1.1.1.1', '1.0.0.1', '8.8.8.8'];
dns.setServers(fallbackDNSServers);

const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  autoIndex: false,
};

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};