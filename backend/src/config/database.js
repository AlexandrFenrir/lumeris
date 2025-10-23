const mongoose = require('mongoose');

/**
 * MongoDB Database Connection Manager
 * Handles connection, reconnection, and error handling
 */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('📊 Using existing database connection');
    return;
  }

  try {
    const mongoURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/lumeris-dapp';

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);

    isConnected = true;

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.log('⚠️  Continuing without database connection');
    isConnected = false;
    // Don't throw error - allow server to start without DB
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    isConnected = false;
    console.log('🔒 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
  }
};

const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  get isConnected() {
    return isConnected;
  }
};
