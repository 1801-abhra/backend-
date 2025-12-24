const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
cors: {
origin: "*",
},
});

io.on("connection", (socket) => {
console.log("Socket connected:", socket.id);

socket.on("disconnect", () => {
console.log("Socket disconnected:", socket.id);
});
});

app.set("io", io);

app.use(cors());
app.use(express.json());

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Mongo error:", err));


app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/rides", require("./src/routes/rides")); 


app.get("/", (req, res) => {
res.send("Traverse backend running");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
console.log("Backend running on", PORT);
});
