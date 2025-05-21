import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
// import authRoutes from './routes/auth.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

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

const rooms = {}; // Object to store room data

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ roomId, name }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} (${name}) joined room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = { users: {} };
    }
    rooms[roomId].users[socket.id] = name;
    console.log("Rooms state after user joined:", rooms);

    io.to(roomId).emit("userJoined", { playerId: socket.id, name });
    console.log("Emitted userJoined:", { playerId: socket.id, name });

    console.log("Rooms state before emitting existingUsers:", rooms);
    const existingUsers = Object.entries(rooms[roomId].users)
      .filter(([id]) => id !== socket.id)
      .map(([id, name]) => ({ playerId: id, name: name }));
    socket.emit("existingUsers", existingUsers);
    console.log("Emitted existingUsers:", existingUsers);
  });

  socket.on("playerAnswer", (data) => {
    io.to(data.roomId).emit("answerReceived", {
      playerId: socket.id,
      answer: data.answer,
    });
  });

  socket.on("nextQuestion", (roomId) => {
    // TODO: Implement logic to fetch and emit the next question
    console.log(`Requesting next question for room: ${roomId}`);
    // Example:
    // const nextQuestionData = await fetchNextQuestion(roomId);
    // io.to(roomId).emit("newQuestion", nextQuestionData);
  });

  socket.on("disconnecting", () => {
    console.log("User disconnecting:", socket.id);
    console.log("Socket rooms on disconnecting:", socket.rooms);

    const currentRooms = Array.from(socket.rooms).filter(
      (r) => r !== socket.id
    ); // Convert Set to Array

    currentRooms.forEach((roomId) => {
      console.log("Checking room:", roomId);
      if (
        rooms[roomId] &&
        rooms[roomId].users &&
        rooms[roomId].users[socket.id]
      ) {
        const name = rooms[roomId].users[socket.id];
        delete rooms[roomId].users[socket.id];
        io.to(roomId).emit("userLeft", { playerId: socket.id, name });
        console.log(`Emitted userLeft to room: ${roomId}`, {
          playerId: socket.id,
          name,
        });
        console.log("Rooms state after userLeft:", rooms);
      } else {
        console.log(
          `User ${socket.id} not found in rooms[${roomId}] or room doesn't exist.`
        );
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✅ Connected to DB: ${mongoose.connection.name}`))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hello from Server.js!!");
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
