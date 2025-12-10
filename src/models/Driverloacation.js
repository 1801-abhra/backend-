const mongoose = require('mongoose');

const DriverLocationSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lat: Number,
  lng: Number,
  speed: Number,
  accuracy: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DriverLocation', DriverLocationSchema);
