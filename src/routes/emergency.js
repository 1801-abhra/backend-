const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Emergency = require('../models/Emergency');

router.post('/report', auth, async (req,res)=>{
  if(req.user.role !== 'student')
    return res.status(403).json({ error: "Students only" });

  const e = await new Emergency({
    student: req.user._id,
    studentEmail: req.user.email,
    ride: req.body.rideId || null,
    description: req.body.description || "Emergency reported",
    location: req.body.location || null
  }).save();

  res.json(e);
});

router.get('/', auth, async (req,res)=>{
  if(req.user.role !== 'admin')
    return res.status(403).json({ error: "Admin only" });

  const list = await Emergency.find();
  res.json(list);
});

router.post('/:id/resolve', auth, async (req,res)=>{
  if(req.user.role !== 'admin')
    return res.status(403).json({ error: "Admin only" });

  const e = await Emergency.findById(req.params.id);
  e.status = "resolved";
  await e.save();

  res.json(e);
});

module.exports = router;
