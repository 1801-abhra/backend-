const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Ride = require("../models/Ride");


router.get("/", async (req, res) => {
try {
const rides = await Ride.find().sort({ createdAt: -1 });
res.json(rides);
} catch (err) {
res.status(500).json({ message: "Failed to fetch rides" });
}
});

router.post("/book", async (req, res) => {
try {
const { pickup, drop } = req.body;

if (
!pickup ||
!drop ||
!pickup.address ||
pickup.lat === undefined ||
pickup.lng === undefined ||
!drop.address ||
drop.lat === undefined ||
drop.lng === undefined
) {
return res.status(400).json({ message: "Missing ride details" });
}

const ride = new Ride({
student: null,
pickup,
drop,
status: "requested",
});

await ride.save();

const io = req.app.get("io");
if (io) {
io.emit("ride:new", ride);
}

res.status(201).json({
message: "Ride booked successfully",
ride,
});
} catch (error) {
console.error("Ride booking error:", error);
res.status(500).json({ message: "Ride booking failed" });
}
});


router.patch("/:id/status", async (req, res) => {
try {
const { id } = req.params;
const { status, driverId } = req.body;

// 1️⃣ Validate ride id
if (!mongoose.Types.ObjectId.isValid(id)) {
return res.status(400).json({ error: "Invalid ride id" });
}

// 2️⃣ Validate driver id ONLY when accepting
if (status === "accepted") {
if (!driverId || !mongoose.Types.ObjectId.isValid(driverId)) {
return res.status(400).json({ error: "Invalid driver id" });
}
}

// 3️⃣ Find ride
const ride = await Ride.findById(id);
if (!ride) {
return res.status(404).json({ error: "Ride not found" });
}

// 4️⃣ Update fields
ride.status = status;

if (status === "accepted") {
ride.driver = driverId; // assign driver
}

// 5️⃣ Save
await ride.save();

// 6️⃣ Emit live updates
if (status === "accepted") {
io.emit("rideAccepted", ride);
}

if (status === "rejected") {
io.emit("rideRejected", ride);
}

res.json({
message: `Ride ${status}`,
ride
});

} catch (err) {
console.error("UPDATE RIDE STATUS ERROR:", err);
res.status(500).json({ error: "Server error" });
}
});



module.exports = router;
