import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  console.log("Captain Data:", captain);

  return (
    <div>
      {/* Captain Info */}
      <div className="flex justify-between items-center">
        {/* Left side: image + name */}
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full object-cover"
            src="https://img.freepik.com/premium-vector/driver-cartoon-vector_889056-101482.jpg"
            alt="Driver"
          />

          <div>
            <h4 className="text-lg font-semibold text-gray-900 capitalize">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h4>
            <p className="text-sm text-gray-500">Captain</p>
          </div>
        </div>

        {/* Right side: earnings */}
        <div className="text-right">
          <h4 className="text-xl font-semibold text-green-600">
            ₹{captain?.earnings || 0}
          </h4>
          <p className="text-sm text-gray-500">Earned</p>
        </div>
      </div>

      {/* STATS PANEL */}
      <div className="bg-gray-200 rounded-2xl py-3 px-3 mt-4 mb-8">
        <div className="flex justify-between">
          <div className="flex flex-col items-center flex-1">
            <i className="ri-timer-fill text-2xl text-gray-700"></i>
            <h5 className="font-medium text-lg">10.2</h5>
            <p className="text-xs text-gray-600">Hours</p>
          </div>

          <div className="flex flex-col items-center flex-1">
            <i className="ri-dashboard-2-fill text-2xl text-gray-700"></i>
            <h5 className="font-medium text-lg">124 km</h5>
            <p className="text-xs text-gray-600">Distance</p>
          </div>

          <div className="flex flex-col items-center flex-1">
            <i className="ri-booklet-fill text-2xl text-gray-700"></i>
            <h5 className="font-medium text-lg">18</h5>
            <p className="text-xs text-gray-600">Trips</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
