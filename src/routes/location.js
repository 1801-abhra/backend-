const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DriverLocation = require('../models/driverlocation');

router.post('/update', auth, async (req,res)=>{
  if(req.user.role !== 'driver')
    return res.status(403).json({ error: "Drivers only" });

  let doc = await DriverLocation.findOne({ driver: req.user._id });

  if(!doc){
    doc = new DriverLocation({
      driver: req.user._id,
      lat: req.body.lat,
      lng: req.body.lng,
      speed: req.body.speed,
      accuracy: req.body.accuracy
    });
  } else {
    doc.lat = req.body.lat;
    doc.lng = req.body.lng;
    doc.speed = req.body.speed;
    doc.accuracy = req.body.accuracy;
    doc.updatedAt = new Date();
  }

  await doc.save();
  res.json(doc);
});

router.get('/', auth, async (req,res)=>{
  if(req.user.role !== 'admin')
    return res.status(403).json({ error: "Admin only" });

  const list = await DriverLocation.find().populate("driver");
  res.json(list);
});

module.exports = router;
