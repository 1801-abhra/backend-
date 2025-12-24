const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/rides", require("./src/routes/rides"));

io.on("connection", (socket) => {
console.log("Socket connected:", socket.id);
});

app.set("io", io);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
console.log("Backend running on", PORT);
});
