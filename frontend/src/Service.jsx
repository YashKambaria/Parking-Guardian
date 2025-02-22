import React, { useState } from "react";

export default function Service({ darkMode }) {
  const [stateCode, setStateCode] = useState("GJ");
  const [carNumber, setCarNumber] = useState("");
  const [error, setError] = useState("");

  // Regex for Indian vehicle plate (e.g., GJ 05 AB 1234)
  const plateRegex = /^[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{1,4}$/;

  // Function to validate and submit
  const handleSubmit = () => {
    const trimmedCarNumber = carNumber.toUpperCase().trim(); // Format input

    if (!plateRegex.test(trimmedCarNumber)) {
      setError("Invalid vehicle number format! Use '05 AB 1234'.");
    } else {
      setError(""); // Clear error
      alert(`Complaint submitted for vehicle: ${stateCode} ${trimmedCarNumber}`);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen transition-colors duration-300`}>
      <div className="container mx-auto mt-20 max-w-3xl p-6 rounded-lg shadow-lg">
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center">📩 Drop an SMS</h1>
        <hr className="my-4 border-gray-400" />

        {/* Instructions Section */}
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
          <h3 className="text-lg font-semibold">Instructions:</h3>
          <p className="mt-2">
            Enter the vehicle number in the correct format: <strong>XX 00 XX 0000</strong>.
          </p>
        </div>

        {/* Complaint Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">🚗 File a Complaint</h3>

          <div className="flex mt-4 items-center">
            {/* State Code Dropdown */}
            <div className={`relative flex items-center rounded-l-md h-10 ${darkMode ? "bg-gray-700" : "bg-gray-200"} border-r border-gray-400`}>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="p-2 appearance-none focus:outline-none h-10 bg-transparent text-inherit cursor-pointer"
              >
                {[
                  "AP", "AR", "AS", "BR", "CG", "CH", "DD", "DL", "GA", "GJ", "HP", "HR", "JH", "JK", "KA", "KL",
                  "LA", "LD", "MH", "ML", "MN", "MP", "MZ", "NL", "OD", "PB", "PY", "RJ", "SK", "TN", "TR", "TS", "UP", "UK", "WB"
                ].map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            {/* Dash (-) Separator */}
            <span className={`h-10 flex items-center px-2 font-semibold text-lg
              ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
              -
            </span>

            {/* Car Number Input */}
            <input
              type="text"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value.toUpperCase())} // Auto uppercase
              placeholder="05 AB 1234"
              maxLength="10"
              className={`w-full p-2 rounded-r-md focus:outline-none h-10 
                ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
          >
            Submit Complaint
          </button>
        </div>
      </div>
    </div>
  );
}
