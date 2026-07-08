const axios = require("axios");
const captainModel = require("../models/captain.model");

// ========================
// Get Coordinates
// ========================
module.exports.getAddressCoordinate = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      throw new Error("Unable to fetch coordinates");
    }

    const location = response.data.results[0].geometry.location;

    return {
      ltd: location.lat,
      lng: location.lng,
    };
  } catch (error) {
    console.error("Geocode API Error:", error.response?.data || error.message);
    throw new Error("Unable to fetch coordinates");
  }
};

// ========================
// Get Distance + Time
// ========================
module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and Destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.post(
      "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
      {
        origins: [
          {
            waypoint: {
              address: origin,
            },
          },
        ],
        destinations: [
          {
            waypoint: {
              address: destination,
            },
          },
        ],
        travelMode: "DRIVE",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "originIndex,destinationIndex,distanceMeters,duration,status",
        },
      },
    );

    const matrixElement = response.data[0];

    if (!matrixElement || matrixElement.status?.code) {
      console.log("Routes API response:", response.data);
      throw new Error("No route found");
    }

    // distance in KM
    const distanceKm = matrixElement.distanceMeters / 1000;

    // duration returned like "1234s"
    const durationSeconds = Number(matrixElement.duration.replace("s", ""));
    const durationMinutes = Math.ceil(durationSeconds / 60);

    return {
      distance: distanceKm,
      time: durationMinutes,
    };
  } catch (error) {
    console.error("Routes API Error:", error.response?.data || error.message);
    throw new Error("Unable to fetch distance and time");
  }
};

// ========================
// Autocomplete Suggestions
// ========================
module.exports.getAutoCompleteSuggestion = async (input) => {
  if (!input) {
    throw new Error("Query is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.post(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        input,
        languageCode: "en",
        regionCode: "IN",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
      },
    );

    const suggestions =
      response.data.suggestions?.map((item) => ({
        placeId: item.placePrediction.placeId,
        description: item.placePrediction.text.text,
      })) || [];

    return suggestions;
  } catch (error) {
    console.error("Places API Error:", error.response?.data || error.message);
    throw new Error("Unable to fetch suggestions");
  }
};
// ========================
// Get Captains closest to the user
// ========================

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  const captains = await captainModel.find({
    geoLocation: {
      $geoWithin: {
        $centerSphere: [[lng, ltd], radius / 6371], // ✅ FIXED
      },
    },
  });

  return captains;
};
