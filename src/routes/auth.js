const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'User')
);


const studentRegex = /^[0-9]{1,10}@juitsolan\\.in$/i;

function emailAllowed(email){
  if(!email) return false;
  email = email.toLowerCase();
  if(studentRegex.test(email)) return true;
  return true;
}

router.post("/signup", async (req, res) => {
try {
const { name, email, password, role } = req.body;

if (!name || !email || !password) {
return res.status(400).json({ error: "All fields required" });
}

const cleanEmail = email.trim().toLowerCase();

const exists = await User.findOne({ email: cleanEmail });
if (exists) {
return res.status(400).json({ error: "Email already used" });
}

const hash = await bcrypt.hash(password, 10);

const user = await new User({
name,
email: cleanEmail,
passwordHash: hash,
role: role || "student"
}).save();

const token = jwt.sign(
{ id: user._id, role: user.role },
process.env.JWT_SECRET,
{ expiresIn: "7d" }
);

res.json({
token,
user: {
id: user._id,
name: user.name,
email: user.email,
role: user.role
}
});

} catch (err) {
console.error("Signup error:", err);
res.status(500).json({ error: "Server error" });
}
});


router.post("/login", async (req, res) => {
try {
const { email, password } = req.body;

if (!email || !password) {
return res.status(400).json({ error: "Email and password required" });
}

const user = await User.findOne({ email });
if (!user) {
return res.status(401).json({ error: "Invalid email or password" });
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(401).json({ error: "Invalid email or password" });
}

const token = jwt.sign(
{ id: user._id, role: user.role },
process.env.JWT_SECRET || "secretkey",
{ expiresIn: "7d" }
);

// ✅ CONSISTENT RESPONSE (IMPORTANT)
res.json({
token,
user: {
_id: user._id,
  role: user.role,
email: user.email

}
});

} catch (err) {
console.error("LOGIN ERROR:", err);
res.status(500).json({ error: "Server error" });
}
});



module.exports = router;
