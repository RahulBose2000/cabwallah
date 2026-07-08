const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  // ✅ accept server here
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on("join", async (data) => {
      const { userId, userType } = data;

      console.log("JOIN RECEIVED:", userId, userType); // ✅ DEBUG

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }

      console.log("✅ Socket stored:", socket.id); // ✅ DEBUG
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // socket.on("update_location_captain", async (data) => {
    //   const { userId, userType, location } = data;
    //   console.log(`user ${userId} updated location to ${location}`);

    //   if (userType === "user") {
    //     await userModel.findByIdAndUpdate(userId, { location });
    //   } else if (userType === "captain") {
    //     await userModel.findByIdAndUpdate(userId, { location });
    //   }
    // });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;
      // console.log(data);

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location" });
      }
      await captainModel.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
        geoLocation: {
          type: "Point",
          coordinates: [location.lng, location.ltd], // ⚠️ [lng, lat]
        },
      });
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  console.log("📤 Attempting emit to:", socketId);

  if (!socketId) {
    console.log("❌ socketId is missing");
    return;
  }

  if (!io) {
    console.log("❌ Socket.io not initialized");
    return;
  }

  io.to(socketId).emit(messageObject.event, messageObject.data);

  console.log("✅ Event emitted:", messageObject.event);
}

module.exports = { initializeSocket, sendMessageToSocketId };
