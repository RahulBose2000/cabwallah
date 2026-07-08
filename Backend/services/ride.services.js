const rideModel = require("../models/ride.models");
const { sendMessageToSocketId } = require("../socket");
const mapService = require("./map.services");
const crypto = require("crypto");

/* ---------------- GET FARE SERVICE ---------------- */

const getFare = async (pickup, destination) => {
  // console.log("control reached to the service before");
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }
  // console.log("control reached to the service before");

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const baseFare = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };

  const perKmRate = {
    auto: 20,
    car: 15,
    motorcycle: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  const fare = {
    auto: Number(
      (
        baseFare.auto +
        distanceTime.distance * perKmRate.auto +
        distanceTime.time * perMinuteRate.auto
      ).toFixed(2),
    ),

    car: Number(
      (
        baseFare.car +
        distanceTime.distance * perKmRate.car +
        distanceTime.time * perMinuteRate.car
      ).toFixed(2),
    ),

    motorcycle: Number(
      (
        baseFare.motorcycle +
        distanceTime.distance * perKmRate.motorcycle +
        distanceTime.time * perMinuteRate.motorcycle
      ).toFixed(2),
    ),
  };

  return fare;
};

/* ---------------- OTP HELPER ---------------- */

function getOtp(num) {
  return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

/* ---------------- CREATE RIDE SERVICE ---------------- */

const createRide = async ({ userId, pickup, destination, vehicleType }) => {
  if (!pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }
  if (!userId) {
    throw new Error("User must be authenticated");
  }

  const fare = await getFare(pickup, destination);

  const ride = await rideModel.create({
    userId,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};

const confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    },
  );

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("userId")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

const startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("userId")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    },
  );

  sendMessageToSocketId(ride.userId.socketId, {
    event: "ride-started",
    data: ride,
  });

  return ride;
};

const endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride Id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("userId")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
      captain: captain._id,
    },
    {
      status: "completed",
    },
  );

  return ride;
};

module.exports = {
  getFare,
  createRide,
  confirmRide,
  startRide,
  endRide,
};
