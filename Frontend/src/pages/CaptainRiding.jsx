import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../pages/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const ride = location.state?.ride;

  console.log("🚖 CAPTAIN RIDING:", ride);

  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? "translateY(0%)" : "translateY(100%)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [finishRidePanel]);

  return (
    <div
      onClick={() => setFinishRidePanel(true)}
      className="h-screen w-screen relative overflow-hidden bg-gray-100 cursor-pointer"
    >
      {/* UP ARROW + PULSE */}
      {!finishRidePanel && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setFinishRidePanel(true);
            }}
            className="relative bg-white shadow-lg rounded-full p-3 active:scale-95 transition animate-bounce"
          >
            <i className="text-2xl text-gray-800 ri-arrow-up-wide-fill"></i>
          </div>
        </div>
      )}

      {/* HEADER */}
      <Link
        to="/captain-home"
        onClick={(e) => e.stopPropagation()}
        className="fixed top-3 left-3 z-50 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur rounded-full shadow-md active:scale-95 transition"
      >
        <img
          className="w-12"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="Uber"
        />
        <i className="ri-logout-box-line text-gray-700 text-lg"></i>
      </Link>

      {/* MAP */}
      <div className="h-[65%] w-full">
        {/* <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1280/0*gwMx05pqII5hbfmX.gif"
          alt="map"
        /> */}
        <LiveTracking ride={ride} />
      </div>

      {/* BOTTOM PANEL */}
      <div className="h-[35%] bg-white rounded-t-3xl shadow-xl px-5 pt-6 pb-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src="https://img.freepik.com/premium-vector/driver-cartoon-vector_889056-101482.jpg"
              alt="Driver"
            />
            <div>
              <p className="text-sm text-gray-500">Ride in progress</p>
              <h4 className="text-lg font-semibold text-gray-900">
                {ride?.distance || 0} km remaining
              </h4>
            </div>
          </div>

          {/* BLINKING LIVE BADGE */}
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-green-700">
              Ride Active
            </span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-4 mt-5 space-y-4">
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-line text-lg"></i>

            <div>
              <p className="text-xs text-gray-500">Pickup</p>

              <p className="text-sm font-medium">{ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <i className="ri-map-pin-fill text-lg"></i>

            <div>
              <p className="text-xs text-gray-500">Destination</p>

              <p className="text-sm font-medium">{ride?.destination}</p>
            </div>
          </div>
        </div>

        {/* END RIDE BUTTON */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setFinishRidePanel(true);
          }}
          className="bg-gray-100 rounded-2xl p-4"
        >
          <button className="w-full bg-green-600 hover:bg-green-700 active:scale-95 transition text-white font-semibold py-3 rounded-xl shadow-md">
            End Ride
          </button>
        </div>
      </div>

      {/* FINISH RIDE SLIDE PANEL */}
      <div
        ref={finishRidePanelRef}
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-0 left-0 w-full z-50 bg-white translate-y-full rounded-t-3xl shadow-2xl px-4 pt-4 pb-6"
      >
        <FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
