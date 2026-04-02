import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.DB_URI) {
    const missingUriError = new Error('DB_URI is not configured in environment variables');
    console.error(missingUriError);
    throw missingUriError;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    return await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 10000,
      appName: 'booking-app',
    });
  } catch (error) {
    console.error('connectDB error', error);
    throw error;
  }
};

export default connectDB;