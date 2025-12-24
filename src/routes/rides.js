const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
router.post("/request", async (req, res) => {
try {
const { studentId, pickup, drop } = req.body;

const ride = await Ride.create({
student: studentId,
pickup,
drop,
});

res.status(201).json({
message: "Ride requested successfully",
ride,
});
} catch (err) {
res.status(500).json({ message: "Ride request failed", error: err });
}
});
router.post("/accept/:rideId", async (req, res) => {
try {
const { driverId } = req.body;
const { rideId } = req.params;

const ride = await Ride.findByIdAndUpdate(
rideId,
{
driver: driverId,
status: "accepted",
},
{ new: true }
);

res.json({ message: "Ride accepted", ride });
} catch (err) {
res.status(500).json({ message: "Accept failed", error: err });
}
});
router.post("/status/:rideId", async (req, res) => {
try {
const { status } = req.body;
const { rideId } = req.params;

const ride = await Ride.findByIdAndUpdate(
rideId,
{ status },
{ new: true }
);

res.json({ message: "Ride status updated", ride });
} catch (err) {
res.status(500).json({ message: "Status update failed", error: err });
}
});
router.get("/active", async (req, res) => {
const rides = await Ride.find({
status: { $in: ["requested", "accepted", "ongoing"] },
}).populate("student driver");

res.json(rides);
});

module.exports = router;
