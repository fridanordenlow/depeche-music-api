import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI || '');
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};
