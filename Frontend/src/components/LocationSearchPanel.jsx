import React from "react";

const LocationSearchPanel = ({
  suggestions,
  activeField,
  setPickup,
  setDestination,
  setPanelOpen,
}) => {
  const handleSelect = (location) => {
    if (activeField === "pickup") {
      setPickup(location.description || location);
    } else {
      setDestination(location.description || location);
    }

    setPanelOpen(false);
  };

  return (
    <div className="px-3 py-2 space-y-3">
      {suggestions && suggestions.length > 0 ? (
        suggestions.map((item, index) => {
          const location = item.description || item;

          return (
            <div
              key={index}
              onClick={() => handleSelect(location)}
              className="flex items-center gap-4 p-3 border rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 active:border-black transition"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
                <i className="ri-map-pin-5-fill text-lg text-gray-700"></i>
              </div>

              <h4 className="font-medium text-gray-800 text-sm">{location}</h4>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-400 text-sm py-5">No suggestions</p>
      )}
    </div>
  );
};

export default LocationSearchPanel;
