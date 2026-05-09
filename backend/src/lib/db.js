import dns from 'dns';
import mongoose from 'mongoose';

const fallbackDNSServers = ['1.1.1.1', '1.0.0.1', '8.8.8.8'];
dns.setServers(fallbackDNSServers);
mongoose.set("strictQuery", true);

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  autoIndex: false,
  maxPoolSize: 10,
  minPoolSize: 5,
};

export const connectDB = async () => {

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    console.time("MONGO_CONNECT");

    const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    console.timeEnd("MONGO_CONNECT");

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.log("Mongoose error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};