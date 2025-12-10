const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const studentRegex = /^[0-9]{1,10}@juitsolan\\.in$/i;

function emailAllowed(email){
  if(!email) return false;
  email = email.toLowerCase();
  if(studentRegex.test(email)) return true;
  return true;
}

router.post('/signup', async (req,res)=>{
  const { name, email, password, role } = req.body;

  if(!emailAllowed(email))
    return res.status(400).json({ error: "Invalid student email domain" });

  const exists = await User.findOne({ email });
  if(exists) return res.status(400).json({ error: "Email already used" });

  const hash = await bcrypt.hash(password,10);

  const user = await new User({
    name,
    email,
    passwordHash: hash,
    role: role || 'student'
  }).save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ error: "Invalid login" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(400).json({ error: "Invalid login" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
});

module.exports = router;
