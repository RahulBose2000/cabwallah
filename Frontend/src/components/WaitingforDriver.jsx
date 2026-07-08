import React from "react";

const WaitingforDriver = ({ setWaitingForDriver, ride }) => {
  console.log("🚖 WAITING RIDE:", ride);
  console.log("🚖 CAPTAIN:", ride?.captain);
  console.log("🚖 VEHICLE:", ride?.captain?.vehicle);
  return (
    <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl border-t">
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

      <button
        className="absolute top-3 left-1/2 -translate-x-1/2 text-gray-400 hover:text-gray-600 transition"
        onClick={() => setWaitingForDriver(false)}
      >
        <i className="text-3xl ri-arrow-down-wide-fill"></i>
      </button>

      <h3 className="text-xl font-semibold text-center mb-5">
        Waiting for your driver
      </h3>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 w-full bg-gray-50 p-3 rounded-xl">
          <div className="flex-shrink-0 bg-white p-2 rounded-xl shadow-sm">
            <img
              className="h-12 w-auto object-contain"
              src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
              alt="Uber Go"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-base font-semibold">
              {ride?.captain?.fullname?.firstname || "Captain"}{" "}
              {ride?.captain?.fullname?.lastname || ""}
            </h2>

            <p className="text-sm text-gray-600">
              {ride?.captain?.vehicle?.vehicleType || "Vehicle"}
            </p>

            <h4 className="text-sm font-bold tracking-wide">
              {ride?.captain?.vehicle?.plate || "Plate Number"}
            </h4>

            <h4 className="text-sm font-bold tracking-wide">
              OTP: {ride?.otp}
            </h4>
            <p className="text-xs text-green-600 font-medium">On the way</p>
          </div>
        </div>

        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-4">
            <i className="text-xl ri-map-pin-5-line text-gray-700 mt-1"></i>
            <div>
              <h4 className="font-medium">Pickup</h4>
              <p className="text-sm text-gray-600">{ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <i className="text-xl ri-map-pin-5-fill text-gray-700 mt-1"></i>
            <div>
              <h4 className="font-medium">Drop</h4>
              <p className="text-sm text-gray-600">{ride?.destination}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <i className="text-xl ri-money-rupee-circle-fill text-gray-700 mt-1"></i>
            <div>
              <h4 className="font-medium">Payment</h4>
              <p className="text-sm text-gray-600">Cash / UPI</p>
              <p className="text-sm text-gray-600">{ride?.fare}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Captain is reaching...
        </div>
      </div>
    </div>
  );
};

export default WaitingforDriver;
