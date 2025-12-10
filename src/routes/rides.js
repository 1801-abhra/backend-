const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ride = require('../models/Ride');

router.post('/', auth, async (req,res)=>{
  if(req.user.role !== 'student')
    return res.status(403).json({ error: "Students only" });

  const ride = await new Ride({
    user: req.user._id,
    userEmail: req.user.email,
    pickup: req.body.pickup,
    dropoff: req.body.dropoff
  }).save();

  res.json(ride);
});

router.get('/', auth, async (req,res)=>{
  if(req.user.role === "student"){
    return res.json(await Ride.find({ user: req.user._id }));
  }

  if(req.user.role === "driver"){
    return res.json(await Ride.find({ status: "requested" }));
  }

  return res.json(await Ride.find());
});

router.post('/:id/accept', auth, async (req,res)=>{
  if(req.user.role !== 'driver')
    return res.status(403).json({ error: "Drivers only" });

  const ride = await Ride.findById(req.params.id);
  ride.status = "accepted";
  ride.driver = req.user._id;
  ride.driverEmail = req.user.email;
  await ride.save();

  res.json(ride);
});

router.post('/:id/start', auth, async (req,res)=>{
  if(req.user.role !== 'driver') return res.status(403).json({ error: "Drivers only" });

  const ride = await Ride.findById(req.params.id);
  ride.status = "ontrip";
  await ride.save();
  res.json(ride);
});

router.post('/:id/complete', auth, async (req,res)=>{
  if(req.user.role !== 'driver') return res.status(403).json({ error: "Drivers only" });

  const ride = await Ride.findById(req.params.id);
  ride.status = "completed";
  await ride.save();
  res.json(ride);
});

router.delete('/:id', auth, async (req,res)=>{
  if(req.user.role !== "admin") return res.status(403).json({ error: "Admins only" });

  await Ride.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
