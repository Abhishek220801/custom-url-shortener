const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// Cache the connection
let cachedConnection = null;

const connectMongoDb = async (url) => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(url || process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = {connectMongoDb};    