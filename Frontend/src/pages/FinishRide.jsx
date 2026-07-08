import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FinishRide = ({ ride, setFinishRidePanel }) => {
  const navigate = useNavigate();

  const endRide = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
      {
        rideId: ride._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (response.status === 200) {
      navigate("/captain-home");
    }
  };

  return (
    <div className="relative px-4 pt-10 pb-6">
      {/* DRAG HANDLE (PERFECT MATCH) */}
      <div
        onClick={() => setFinishRidePanel(false)}
        className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
      >
        {/* <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-1"></div> */}
        <i className="font-bold ri-arrow-down-wide-fill text-3xl  text-gray-400"></i>
      </div>

      {/* TITLE */}
      <h3 className="text-2xl font-semibold text-center mb-6">
        Finish this Ride
      </h3>

      {/* USER STRIP */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt="user"
          />
          <h4 className="font-semibold text-gray-900">
            {ride?.userId?.fullname?.firstname}
          </h4>
        </div>
        <span className="font-semibold text-gray-700">2.2 KM</span>
      </div>

      {/* RIDE DETAILS */}
      <div className="bg-gray-100 rounded-2xl p-4 space-y-4">
        <div className="flex items-start gap-4">
          <i className="ri-map-pin-user-fill text-lg text-gray-700 mt-1"></i>
          <div>
            <h4 className="font-medium">Pickup</h4>
            <p className="text-sm text-gray-600">{ride?.pickup}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <i className="ri-map-pin-2-fill text-lg text-gray-700 mt-1"></i>
          <div>
            <h4 className="font-medium">Drop</h4>
            <p className="text-sm text-gray-600">{ride?.destination}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <i className="ri-currency-line text-lg text-gray-700 mt-1"></i>
          <div>
            <h4 className="font-medium">₹ {ride?.fare}</h4>
            <p className="text-sm text-gray-600">Cash / UPI</p>
          </div>
        </div>
      </div>

      {/* FINISH BUTTON */}
      <button
        onClick={endRide}
        className="w-full mt-6 bg-green-600 hover:bg-green-700 active:scale-95 transition text-white font-semibold py-3 rounded-xl shadow-md"
      >
        Finish Ride
      </button>
      <p className="text-red-500 mt-10 text-xs">
        Click on finish ride button only if you have completed the ride
      </p>
    </div>
  );
};

export default FinishRide;
