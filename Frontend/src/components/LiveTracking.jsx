import React, { useEffect, useState } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const LiveTracking = ({ ride }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (
      !currentPosition ||
      !ride?.destination?.lat ||
      !ride?.destination?.lng ||
      !window.google
    ) {
      setDirections(null);
      setDistance("");
      setDuration("");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: currentPosition,
        destination: ride.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);

          const leg = result.routes[0].legs[0];

          setDistance(leg.distance.text);
          setDuration(leg.duration.text);
        }
      },
    );
  }, [currentPosition, ride]);

  if (!currentPosition) {
    return <div>Getting current location...</div>;
  }

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={15}
        >
          {/* Current Location */}
          <Marker
            position={currentPosition}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />

          <Circle
            center={currentPosition}
            radius={20}
            options={{
              fillColor: "#4285F4",
              fillOpacity: 0.3,
              strokeColor: "#4285F4",
              strokeWeight: 2,
            }}
          />

          {/* Destination Marker */}
          {ride?.destination && <Marker position={ride.destination} />}

          {/* Route */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>

        {ride?.destination && distance && (
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow">
            <p>
              <strong>Distance:</strong> {distance}
            </p>
            <p>
              <strong>ETA:</strong> {duration}
            </p>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default LiveTracking;
