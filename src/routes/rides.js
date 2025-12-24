const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
router.post("/book", async (req, res) => {
try {
const { studentId, pickup, drop } = req.body;

if (!studentId || !pickup || !drop) {
return res.status(400).json({ message: "Missing ride details" });
}

const ride = new Ride({
student: studentId,
pickup: {
address: pickup.address,
lat: pickup.lat,
lng: pickup.lng
},
drop: {
address: drop.address,
lat: drop.lat,
lng: drop.lng
},
status: "requested"
});

await ride.save();

const io = req.app.get("io");
if (io) {
io.emit("ride:new", ride);
}

res.status(201).json({
message: "Ride booked successfully",
ride
});

} catch (error) {
console.error("Ride booking error:", error);
res.status(500).json({ message: "Ride booking failed" });
}
});

module.exports = router;
