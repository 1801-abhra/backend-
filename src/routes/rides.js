const express = require("express");
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
const { status } = req.body;

const ride = await Ride.findByIdAndUpdate(
req.params.id,
{ status },
{ new: true }
);

if (!ride) {
return res.status(404).json({ message: "Ride not found" });
}

const io = req.app.get("io");
if (io) {
io.emit("ride:update", ride);
}

res.json(ride);
} catch (error) {
console.error("Status update error:", error);
res.status(500).json({ message: "Status update failed" });
}
});

module.exports = router;
