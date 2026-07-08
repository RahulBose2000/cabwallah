const rideService = require("../services/ride.services");
const mapService = require("../services/map.services");
const { validationResult } = require("express-validator");
const { sendMessageToSocketId } = require("../socket");
const rideModels = require("../models/ride.models");
const captainModel = require("../models/captain.model");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log("ride to be created");
  const { pickup, destination, vehicleType } = req.body;

  try {
    console.log("Inside the try block");

    const ride = await rideService.createRide({
      userId: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    console.log("After ride is created", ride);

    // ✅ GET COORDINATES
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    console.log("PICKUP COORDS:", pickupCoordinates);

    // ✅ GET DISTANCE + TIME
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    // ✅ GET CAPTAINS (MAKE SURE ORDER IS CORRECT INSIDE SERVICE)
    const captainsInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.ltd,
      pickupCoordinates.lng,
      2,
    );

    ride.otp = "";

    // ✅ POPULATE USER
    const rideWithUserRaw = await rideModels
      .findOne({ _id: ride._id })
      .populate("userId");

    // ✅ NORMALIZE DATA
    const rideWithUser = {
      ...rideWithUserRaw.toObject(),
      user: rideWithUserRaw.userId,
      distance: distanceTime.distance,
      time: distanceTime.time,
    };

    delete rideWithUser.userId;

    // ✅ SEND TO CAPTAINS
    for (const captain of captainsInRadius) {
      if (!captain.socketId) {
        console.log("❌ NO SOCKET FOR:", captain._id);
        continue;
      }

      console.log("📤 SENDING TO:", captain.socketId);

      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    }

    console.log("🚀 CAPTAINS FOUND:", captainsInRadius.length);
    console.log(
      "🚀 SOCKET IDS:",
      captainsInRadius.map((c) => c.socketId),
    );

    return res.status(201).json(ride);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getFare = async (req, res) => {
  // console.log("control reached to the controller");
  // console.log("Query params:", req.query);
  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);

    return res.status(200).json(fare);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  console.log("confirmRide");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    const rideData = {
      ...ride.toObject(),
      user: ride.userId,
    };

    delete rideData.userId;

    console.log("✅ FINAL CONFIRMED RIDE:", rideData);

    console.log("🔥 USER SOCKET:", ride.userId?.socketId);

    sendMessageToSocketId(ride.userId.socketId, {
      event: "ride-confirmed",
      data: rideData,
    });

    return res.status(200).json(rideData);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array });
  }
  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.userId.socketId, {
      event: "ride-started",
      data: ride,
    });
    return res.status(200).json(ride);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({
      rideId,
      captain: req.captain._id,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
