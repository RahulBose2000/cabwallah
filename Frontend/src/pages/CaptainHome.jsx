import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // ✅ JOIN + LOCATION (correct)
  useEffect(() => {
    if (!socket || !captain?._id) return;

    const handleConnect = () => {
      console.log("🌐 SOCKET READY:", socket.id);

      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });

      const updateLocation = () => {
        navigator.geolocation?.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      };

      updateLocation();
      const interval = setInterval(updateLocation, 10000);

      return () => clearInterval(interval);
    };

    if (socket.connected) handleConnect();
    else socket.on("connect", handleConnect);

    return () => socket.off("connect", handleConnect);
  }, [socket, captain]);

  // ✅ NEW RIDE LISTENER
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("🔥 NEW RIDE DATA:", data);

      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  // ✅ FIXED GSAP (NO CONFLICT)
  useEffect(() => {
    if (!ridePopupPanelRef.current) return;

    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        y: "0%",
        duration: 0.35,
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        y: "100%",
        duration: 0.35,
      });
    }
  }, [ridePopupPanel]);

  useEffect(() => {
    console.log("🔥 OTP PANEL STATE:", confirmRidePopupPanel);
    if (!confirmRidePopupPanelRef.current) return;

    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        y: "0%",
        duration: 0.35,
      });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        y: "100%",
        duration: 0.35,
      });
    }
  }, [confirmRidePopupPanel]);

  async function confirmRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  // useGSAP(
  //   function () {
  //     if (ridePopupPanel) {
  //       gsap.to(ridePopupPanelRef.current, {
  //         transform: "translateY(0)",
  //       });
  //     } else {
  //       gsap.to(ridePopupPanelRef.current, {
  //         transform: "translateY(100%)",
  //       });
  //     }
  //   },
  //   [ridePopupPanel],
  // );

  // useGSAP(
  //   function () {
  //     if (confirmRidePopupPanel) {
  //       gsap.to(confirmRidePopupPanelRef.current, {
  //         transform: "translateY(0)",
  //       });
  //     } else {
  //       gsap.to(confirmRidePopupPanelRef.current, {
  //         transform: "translateY(100%)",
  //       });
  //     }
  //   },
  //   [confirmRidePopupPanel],
  // );

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-100">
      {/* HEADER */}
      <Link
        to="/home"
        className="fixed top-3 left-3 z-50 flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-md"
      >
        <img
          className="w-12"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="Uber"
        />
      </Link>

      {/* MAP */}
      <div className="h-[65%] w-full">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1280/0*gwMx05pqII5hbfmX.gif"
          alt="map"
        />
      </div>

      {/* BOTTOM PANEL */}
      <div className="h-[35%] bg-white rounded-t-3xl px-5 pt-4">
        <CaptainDetails />
      </div>

      {/* ✅ RIDE POPUP */}
      <div
        ref={ridePopupPanelRef}
        className="fixed bottom-0 left-0 w-full z-40 bg-white rounded-t-3xl px-4 pt-4 pb-6"
        style={{ transform: "translateY(100%)" }} // ✅ IMPORTANT
      >
        <RidePopup
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* CONFIRM POPUP */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed bottom-0 left-0 w-full h-screen z-50 bg-white px-4 pt-4 pb-6"
        style={{ transform: "translateY(100%)" }}
      >
        <ConfirmRidePopup
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
