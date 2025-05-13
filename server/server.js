import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

//serve html file:
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

//serve html file:
// const __dirname = dirname(fileURLToPath(import.meta.url));
// app.get("/", (req, res) => {
//   res.sendFile(join(__dirname, "index.html"));
// });

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

import mongoose from "mongoose";
import authRoutes from "./controllers/auth.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/api/auth", authRoutes);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✅ Connected to DB: ${mongoose.connection.name}`))
  .catch((err) => console.error(err));

// io.on("connection", (socket) => {
//   // join the room named 'some room'
//   socket.join("some room");

//   // broadcast to all connected clients in the room
//   io.to("some room").emit("hello", "world");

//   //   // broadcast to all connected clients except those in the room
//   //   io.except("some room").emit("hello", "world");

//   // leave the room
//   socket.leave("some room");
// });

app.get("/", (req, res) => {
  res.send("Hello from Server.js!!");
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
