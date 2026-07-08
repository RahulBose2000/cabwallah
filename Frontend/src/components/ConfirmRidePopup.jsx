import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const ConfirmRidePopup = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride?._id,
            otp: otp,
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("✅ RIDE STARTED:", res.data);

      props.setConfirmRidePopupPanel(false);

      if (props.setRidePopupPanel) {
        props.setRidePopupPanel(false);
      }

      navigate("/captain-riding", {
        state: {
          ride: res.data,
        },
      });
    } catch (err) {
      console.log(err);

      console.log(err.response?.data);
    }
  };

  return (
    <div className="relative px-4 pb-6">
      {/* HEADER */}
      <div className="relative pt-8 pb-4">
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer"
          onClick={() => props.setConfirmRidePopupPanel(false)}
        />
        <h3 className="text-lg font-semibold text-center text-gray-900">
          Confirm ride
        </h3>
      </div>

      {/* NEW USER STRIP (REPLACED) */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            // src="https://rapidapi-prod-apis.s3.amazonaws.com/b42aa17d-8ae0-4a28-b29f-587af5454390.png"
            alt="user"
          />
          <h4 className="font-semibold text-gray-900 capitalize">
            {props.ride?.user.fullname.firstname}
          </h4>
        </div>
        <span className="font-semibold text-gray-700">2.2 KM</span>
      </div>

      {/* RIDE DETAILS */}
      <div className="bg-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-5-line text-lg text-gray-700 mt-1"></i>
          <div>
            <p className="text-xs font-medium text-gray-700">Pickup</p>
            <p className="text-xs text-gray-600">{props.ride?.pickup}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <i className="ri-map-pin-5-fill text-lg text-gray-700 mt-1"></i>
          <div>
            <p className="text-xs font-medium text-gray-700">Drop</p>
            <p className="text-xs text-gray-600">{props.ride?.destination}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <i className="ri-money-rupee-circle-fill text-lg text-gray-700 mt-1"></i>
          <div>
            <p className="text-xs font-medium text-gray-700">Payment</p>
            <p className="text-xs text-gray-600">Cash / UPI</p>
            <p className="text-xs text-gray-600">{props.ride?.fare}</p>
          </div>
        </div>
      </div>

      {/* OTP FORM */}
      <form onSubmit={submitHandler}>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          placeholder="Enter OTP"
          className="w-full mt-5 px-4 py-3 font-mono rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 active:scale-95 transition text-white font-semibold py-3 rounded-xl shadow-md"
          >
            Confirm Ride
          </button>

          <button
            type="button"
            onClick={() => {
              props.createRide();
              props.setConfirmedRidePanel(false);
              props.setVehicleFound(true);
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 transition text-white font-medium py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmRidePopup;
