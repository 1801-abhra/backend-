const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_URL || true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

app.use('/api/auth', require(path.join(__dirname, 'routes/auth')));
app.use('/api/rides', require(path.join(__dirname, 'routes/rides')));
app.use('/api/users', require(path.join(__dirname, 'routes/users')));
app.use('/api/emergency', require(path.join(__dirname, 'routes/emergency')));
app.use('/api/location', require(path.join(__dirname, 'routes/location')));


app.use(express.static('../frontend'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("Backend running on", PORT));
