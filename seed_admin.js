require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> seed())
  .catch(err => console.error(err));

async function seed(){
  const existing = await User.findOne({ email: 'admin@traverse.com' });
  if(existing){
    console.log("Admin already exists");
    process.exit(0);
  }

  const hash = await bcrypt.hash("Admin@123", 10);
  await new User({
    name: "Administrator",
    email: "admin@traverse.com",
    passwordHash: hash,
    role: "admin"
  }).save();

  console.log("Admin created: admin@traverse.com / Admin@123");
  process.exit(0);
}
