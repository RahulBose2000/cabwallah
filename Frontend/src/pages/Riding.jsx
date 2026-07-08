import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  return (
    <div className="h-screen flex flex-col bg-white relative">
      {/* HOME BUTTON */}
      <Link
        to={"/home"}
        className="fixed right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md active:scale-95 transition"
      >
        <i className="text-lg ri-home-5-line text-gray-700"></i>
      </Link>

      {/* MAP SECTION */}
      <div className="h-1/2 relative">
        {/* <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1280/0*gwMx05pqII5hbfmX.gif"
          alt="map"
        /> */}
        <LiveTracking ride={ride} />
      </div>

      {/* DETAILS SECTION */}
      <div className="flex-1 px-4 py-6 flex flex-col justify-between bg-white rounded-t-3xl -mt-6 shadow-lg">
        <div className="flex flex-col items-center gap-6">
          {/* VEHICLE IMAGE */}
          <img
            className="h-20 object-contain"
            src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
            alt="Uber Go"
          />

          {/* INFO CARD */}
          <div className="w-full bg-gray-50 rounded-2xl p-5 space-y-5">
            {/* DROP LOCATION */}
            <div className="flex gap-4">
              <i className="text-xl ri-map-pin-5-fill text-gray-700 mt-1"></i>
              <div>
                <h4 className="font-semibold text-gray-800">Drop Location</h4>
                <p className="text-sm text-gray-600">{ride?.destination}</p>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="flex gap-4">
              <i className="text-xl ri-money-rupee-circle-fill text-gray-700 mt-1"></i>
              <div>
                <h4 className="font-semibold text-gray-800">{ride?.fare}</h4>
                <p className="text-sm text-gray-600">Cash / UPI</p>
              </div>
            </div>
          </div>
        </div>
        {/* {ride && (
          <div className="w-full bg-gray-50 rounded-2xl p-5 mt-4">
            <h2 className="font-semibold text-lg">Ride ID: {ride?.id}</h2>

            <p className="text-sm text-gray-600">Pickup: {ride?.pickup}</p>

            <p className="text-sm text-gray-600">
              Destination: {ride?.destination}
            </p>
          </div>
        )} */}

        {/* PAYMENT BUTTON */}
        <button className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.99] transition text-white font-semibold py-3 rounded-2xl shadow-md mt-6">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
