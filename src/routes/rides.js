const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");


router.post("/book", async (req, res) => {
try {
const { userId, pickup, drop } = req.body;

if (!userId || !pickup || !drop) {
return res.status(400).json({ message: "Missing ride details" });
}

const ride = new Ride({
userId,
pickup,
drop,
status: "requested",
createdAt: new Date()
});

await ride.save();

const io = req.app.get("io");
io.emit("ride:new", ride);

res.status(201).json({
message: "Ride booked successfully",
ride
});

} catch (err) {
console.error(err);
res.status(500).json({ message: "Ride booking failed" });
}
});

module.exports = router;

