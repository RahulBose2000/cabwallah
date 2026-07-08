import React from "react";

const VehiclePanel = ({
  fare,
  setVehiclePanel,
  setConfirmedRidePanel,
  selectVehicle,
}) => {
  const handleSelect = (type) => {
    selectVehicle(type);
    setVehiclePanel(false);
    setConfirmedRidePanel(true);
  };

  return (
    <div className="w-full bg-white px-4 py-8 pt-14 space-y-3 rounded-t-2xl shadow-xl">
      <h5
        className="p-3 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setVehiclePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>

      {/* CAR */}
      <div
        onClick={() => handleSelect("car")}
        className="flex items-center justify-between p-4 bg-gray-100 rounded-xl cursor-pointer hover:border-black border transition"
      >
        <img
          className="h-12 object-contain"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
        />

        <div className="w-1/2">
          <h4 className="font-semibold text-sm flex items-center gap-1">
            Uber Go <i className="ri-user-fill text-xs"></i> <span>4</span>
          </h4>

          <p className="text-xs text-gray-600">Affordable compact rides</p>
        </div>

        <h2 className="font-semibold">₹{fare?.car}</h2>
      </div>

      {/* MOTORCYCLE */}
      <div
        onClick={() => handleSelect("motorcycle")}
        className="flex items-center justify-between p-4 bg-gray-100 rounded-xl cursor-pointer hover:border-black border transition"
      >
        <img
          className="h-12 object-contain"
          src="https://thepack.news/wp-content/uploads/2023/01/Auper_incity.jpg"
        />

        <div className="w-1/2">
          <h4 className="font-semibold text-sm flex items-center gap-1">
            Uber Bike <i className="ri-user-fill text-xs"></i> <span>1</span>
          </h4>

          <p className="text-xs text-gray-600">Quick bike rides</p>
        </div>

        <h2 className="font-semibold">₹{fare?.motorcycle}</h2>
      </div>

      {/* AUTO */}
      <div
        onClick={() => handleSelect("auto")}
        className="flex items-center justify-between p-4 bg-gray-100 rounded-xl cursor-pointer hover:border-black border transition"
      >
        <img
          className="h-12 object-contain"
          src="https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png"
        />

        <div className="w-1/2">
          <h4 className="font-semibold text-sm flex items-center gap-1">
            Uber Auto <i className="ri-user-fill text-xs"></i> <span>3</span>
          </h4>

          <p className="text-xs text-gray-600">Affordable auto rides</p>
        </div>

        <h2 className="font-semibold">₹{fare?.auto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
