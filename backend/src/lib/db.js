import dns from 'dns';
import mongoose from 'mongoose';

dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.set("strictQuery", true);
mongoose.set("sanitizeFilter", true);;

console.log("CURRENT MONGO URI >>>", process.env.MONGO_URI);

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
};


export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    console.log("Connecting MongoDB...");

    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      mongoOptions
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.log("Mongoose error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

  } catch (error) {
    console.log("MongoDB connection error:", error.message);
    process.exit(1);
  }
};