const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: Date,
});

// Create a model based on the schema
const Coordinate = mongoose.model('Coordinate', coordinateSchema);

module.exports = Coordinate;
