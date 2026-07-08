import React from "react";

const LookingForDriver = (props) => {
  return (
    <div className="relative bg-white rounded-t-3xl p-5 shadow-xl">
      <button
        className="absolute top-3 left-1/2 -translate-x-1/2 text-gray-400"
        onClick={() => {
          setVehicleFound(false);
          setWaitingForDriver(true);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-fill"></i>
      </button>

      <h3 className="text-2xl font-semibold text-center mt-6 mb-5">
        Looking For Your Driver
      </h3>

      <div className="flex flex-col items-center gap-6">
        <img
          className="h-20 object-contain"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt="Uber Go"
        />

        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-4">
            <i className="text-xl ri-map-pin-5-line text-gray-700 mt-1"></i>
            <div>
              <h4 className="font-medium">Pickup</h4>
              <p className="text-sm text-gray-600">{props.pickup}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <i className="text-xl ri-map-pin-5-fill text-gray-700 mt-1"></i>
            <div>
              <h4 className="font-medium">Drop</h4>
              <p className="text-sm text-gray-600">{props.destination}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <i className="text-xl ri-money-rupee-circle-fill text-gray-700 mt-1"></i>
            <div>
              <h4 className="font-medium">Payment</h4>
              <p className="text-sm text-gray-600">Cash / UPI</p>
              <p className="text-sm text-gray-600 font-semibold">
                ₹ {props.fare[props.vehicleType]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
