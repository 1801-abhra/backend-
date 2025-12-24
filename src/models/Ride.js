const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
{
student: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},

driver: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
default: null,
},

pickup: {
address: { type: String, required: true },
lat: { type: Number, required: true },
lng: { type: Number, required: true },
},

drop: {
address: { type: String, required: true },
lat: { type: Number, required: true },
lng: { type: Number, required: true },
},

status: {
type: String,
enum: ["requested", "accepted", "ongoing", "completed", "cancelled"],
default: "requested",
},

fare: {
type: Number,
default: 0,
},

requestedAt: {
type: Date,
default: Date.now,
},
},
{ timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);

