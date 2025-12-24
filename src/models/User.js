const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
name: {
type: String,
required: true,
trim: true
},

email: {
type: String,
required: true,
unique: true,
lowercase: true,
trim: true
},

passwordHash: {
type: String,
required: true
},

role: {
type: String,
enum: ["student", "driver", "admin"],
default: "student"
},

// ===== DRIVER-SPECIFIC FIELDS =====
vehicle: {
type: String,
default: null
},

phone: {
type: String,
default: null
},

isAvailable: {
type: Boolean,
default: true
},

// =================================

createdAt: {
type: Date,
default: Date.now
}
});

module.exports = mongoose.model("User", UserSchema);
