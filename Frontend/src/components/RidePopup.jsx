import React from "react";
import axios from "axios";

const RidePopup = ({ setRidePopupPanel, setConfirmRidePopupPanel, ride }) => {
  if (!ride || !ride.user) return null;

  return (
    <div className="relative bg-white rounded-t-3xl p-5 shadow-xl">
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

      <h3 className="text-xl font-semibold text-center mb-5">
        New Ride Available
      </h3>

      <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
          />

          <h4 className="font-semibold">
            {ride?.user?.fullname?.firstname +
              " " +
              ride?.user?.fullname?.lastname}
          </h4>
        </div>

        <span className="font-semibold">{ride.distance}KM</span>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 space-y-4">
        <div className="flex gap-3">
          <i className="ri-map-pin-line"></i>
          <p>{ride?.pickup}</p>
        </div>

        <div className="flex gap-3">
          <i className="ri-map-pin-fill"></i>
          <p>{ride?.destination}</p>
        </div>

        <div className="flex gap-3">
          <i className="ri-money-rupee-circle-fill"></i>
          <p>{ride?.fare}</p>
          <p>Cash / UPI</p>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={async () => {
            try {
              const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                {
                  rideId: ride._id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );

              console.log("✅ RIDE ACCEPTED:", res.data);

              setRidePopupPanel(false);

              setTimeout(() => {
                console.log("🔥 SET OTP POPUP TRUE");
                setConfirmRidePopupPanel(true);
              }, 300);
            } catch (err) {
              console.log(err);
            }
          }}
          className="flex-1 bg-green-500 text-white py-3 rounded-xl"
        >
          Accept
        </button>

        <button
          onClick={() => setRidePopupPanel(false)}
          className="flex-1 bg-gray-200 py-3 rounded-xl"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopup;
