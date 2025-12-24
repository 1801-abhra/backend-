const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
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
return res.status(400).json({
message: "Missing ride details",
});
}

const ride = new Ride({
student: null,
pickup: {
address: pickup.address,
lat: pickup.lat,
lng: pickup.lng,
},
drop: {
address: drop.address,
lat: drop.lat,
lng: drop.lng,
},
status: "requested",
});

await ride.save();

const io = req.app.get("io");
if (io) {
io.emit("ride:new", ride);
}

return res.status(201).json({
message: "Ride booked successfully",
ride,
});
} catch (error) {
console.error("Ride booking error:", error);
return res.status(500).json({
message: "Ride booking failed",
});
}
});

module.exports = router;
