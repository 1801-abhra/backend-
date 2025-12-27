const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Ride = require("../models/Ride");


router.get("/", async (req, res) => {
try {
const rides = await Ride.find()
.populate("driver", "name email")
.sort({ createdAt: -1 });

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
console.log("🚕 Emitting ride:new", ride._id);
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
const { status, driverId } = req.body;

if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
return res.status(400).json({ message: "Invalid ride id" });
}

if (!mongoose.Types.ObjectId.isValid(driverId)) {
return res.status(400).json({ message: "Invalid driver id" });
}

const ride = await Ride.findById(req.params.id);
if (!ride) {
return res.status(404).json({ message: "Ride not found" });
}

ride.status = status;
ride.driver = driverId;

const populatedRide = await Ride.findById(ride._id)
.populate("driver", "name email phone");

const io = req.app.get("io");
if (io) {
io.emit("ride:update", populatedRide);
}

res.json({
message: "Ride updated successfully",
ride: populatedRide
});
} catch (err) {
console.error("UPDATE RIDE STATUS ERROR:", err);
res.status(500).json({ message: "Server error" });
}
});




module.exports = router;
