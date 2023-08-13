const mongoose = require('mongoose');

// Replace 'YOUR_LOCAL_DB_URL' with your local MongoDB URL
const mongoURI = 'mongodb://127.0.0.1:27017/GeoHack';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = connectDB;
