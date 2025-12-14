const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const path = require('path');
const User = require(
  path.join(__dirname, '..', 'models', 'User')
);

const bcrypt = require('bcryptjs');

router.get('/', auth, async (req,res)=>{
  if(req.user.role !== 'admin') return res.status(403).json({ error: "Admin only" });

  const users = await User.find().select("-passwordHash");
  res.json(users);
});

router.post('/', auth, async (req,res)=>{
  if(req.user.role !== 'admin') return res.status(403).json({ error: "Admin only" });

  const exists = await User.findOne({ email: req.body.email });
  if(exists) return res.status(400).json({ error: "Email exists" });

  const hash = await bcrypt.hash(req.body.password,10);

  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: hash,
    role: req.body.role,
    vehicle: req.body.vehicle,
    phone: req.body.phone
  }).save();

  res.json(user);
});

module.exports = router;
