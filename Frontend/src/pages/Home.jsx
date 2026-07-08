import React, { useRef, useState, useContext, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingforDriver from "../components/WaitingForDriver";

import UserContext, { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [activeField, setActiveField] = useState(null);

  const [vehicleType, setVehicleType] = useState(null);
  const [fare, setFare] = useState({});
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const { socket } = useContext(SocketContext);

  /* VEHICLE PANEL */
  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      y: vehiclePanel ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [vehiclePanel]);

  /* CONFIRM PANEL */
  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      y: confirmRidePanel ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [confirmRidePanel]);

  /* LOOKING DRIVER */
  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      y: vehicleFound ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [vehicleFound]);

  /* WAITING DRIVER */
  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      y: waitingForDriver ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [waitingForDriver]);
  useEffect(() => {
    if (!user) return;
    // console.log(user);

    socket.emit("join", {
      userId: user._id,
      userType: "user",
    });
  }, [user]);

  // socket.on("ride-confirmed", (ride) => {
  //   setVehicleFound(false);
  //   setWaitingForDriver(true);
  //   setRide(ride);
  // });
  useEffect(() => {
    if (!socket) return;

    // const handleRideConfirmed = (rideData) => {
    //   console.log(
    //     "✅ SOCKET CONFIRMED RIDE:",
    //     JSON.stringify(rideData, null, 2),
    //   );

    //   setVehicleFound(false);
    //   setWaitingForDriver(true);

    //   setRide(rideData);
    // };

    const handleRideConfirmed = (rideData) => {
      // console.log("🔥 USER SOCKET:", ride.userId?.socketId);

      console.log(
        "✅ SOCKET CONFIRMED RIDE:",
        JSON.stringify(rideData, null, 2),
      );

      // CLOSE OLD PANEL COMPLETELY
      setVehicleFound(false);

      // IMPORTANT: SMALL DELAY
      setTimeout(() => {
        setRide(rideData);

        setWaitingForDriver(true);
      }, 300);
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket]);

  socket.on("ride-started", (ride) => {
    console.log("🚀 USER RIDE STARTED:", ride);

    navigate("/riding", {
      state: {
        ride,
      },
    });
  });

  /* PICKUP INPUT */
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    if (value.length < 3) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: value },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      setPickupSuggestions(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  /* DESTINATION INPUT */
  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length < 3) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setDestinationSuggestions(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  /* FIND TRIP */
  const findTrip = async () => {
    if (!pickup || !destination) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setFare(res.data);
      setPanelOpen(false);
      setVehiclePanel(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  /* CREATE RIDE */
  const createRide = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      { pickup, destination, vehicleType },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );

    // setRide(res.data);
    setConfirmRidePanel(false);
    setVehicleFound(true);
  };

  /* LOGOUT */
  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* MAP */}
      {/* <img
        className="absolute inset-0 h-full w-full object-cover"
        src="https://miro.medium.com/v2/resize:fit:1280/0*gwMx05pqII5hbfmX.gif"
      /> */}
      <LiveTracking />

      {/* TOP BAR */}
      <div className="absolute top-5 left-0 right-0 flex justify-between items-center px-6 z-20">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        />

        <button
          onClick={logoutHandler}
          className="bg-white shadow-md rounded-full p-3"
        >
          <i className="ri-logout-box-r-line text-xl"></i>
        </button>
      </div>

      {/* SEARCH PANEL */}
      {!vehiclePanel && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl z-40 transition-all duration-300 ${
            panelOpen ? "h-[85vh]" : "min-h-[220px]"
          }`}
        >
          {panelOpen && (
            <div className="flex justify-center pt-3">
              <button
                onClick={() => setPanelOpen(false)}
                className="text-3xl text-gray-500"
              >
                <i className="ri-arrow-down-wide-line"></i>
              </button>
            </div>
          )}

          <div className="px-6 pt-4 pb-4 border-b">
            <h4 className="text-2xl font-semibold mb-5">Find a trip</h4>

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-5 py-3 text-lg rounded-xl w-full"
              placeholder="Add pickup location"
            />

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-5 py-3 text-lg rounded-xl w-full mt-4"
              placeholder="Enter destination"
            />

            <button
              onClick={findTrip}
              className="bg-black text-white px-4 py-3 rounded-xl mt-6 w-full text-lg"
            >
              Find Trip
            </button>
          </div>

          {panelOpen && (
            <div className="overflow-y-auto h-[55vh] px-4 pb-10">
              <LocationSearchPanel
                suggestions={
                  activeField === "pickup"
                    ? pickupSuggestions
                    : destinationSuggestions
                }
                activeField={activeField}
                setPickup={setPickup}
                setDestination={setDestination}
                setPanelOpen={setPanelOpen}
              />
            </div>
          )}
        </div>
      )}

      {/* VEHICLE PANEL */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full bottom-0 translate-y-full bg-white px-3 py-10 pt-12 z-50"
      >
        <VehiclePanel
          fare={fare}
          selectVehicle={setVehicleType}
          setVehiclePanel={setVehiclePanel}
          setConfirmedRidePanel={setConfirmRidePanel}
        />
      </div>

      {/* CONFIRM PANEL */}
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12 z-[60]"
      >
        <ConfirmRide
          fare={fare}
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
          setConfirmedRidePanel={setConfirmRidePanel}
        />
      </div>

      {/* LOOKING DRIVER */}
      <div
        ref={vehicleFoundRef}
        className="fixed w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12 z-[70]"
      >
        <LookingForDriver
          fare={fare}
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>

      {/* WAITING DRIVER */}
      <div
        ref={waitingForDriverRef}
        className="fixed w-full bottom-0 translate-y-full bg-white px-3 py-6 pt-12 z-[80]"
      >
        <WaitingforDriver
          ride={ride}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
