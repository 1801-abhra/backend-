const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: String,
  pickup: String,
  dropoff: String,
  status: { type: String, enum: ['requested','accepted','ontrip','completed','cancelled'], default: 'requested' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  driverEmail: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', RideSchema);
