const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentEmail: String,
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', default: null },
  description: String,
  location: { lat: Number, lng: Number },
  status: { type: String, enum: ['open','resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emergency', EmergencySchema);
