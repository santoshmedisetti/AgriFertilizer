import mongoose from 'mongoose';

const connectDB = async (retries = 3, delay = 5000) => {
  while (retries > 0) {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in the environment variables.');
      }
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      retries -= 1;
      if (retries === 0) {
        console.error('All MongoDB connection retries failed. Exiting gracefully...');
        process.exit(1);
      }
      console.log(`Retrying MongoDB connection in ${delay / 1000} seconds... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
