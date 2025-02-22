import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Service({ darkMode }) {
  const [stateCode, setStateCode] = useState("GJ");
  const [carNumber, setCarNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSlide, setShowSlide] = useState("sms");

  // Regex for Indian vehicle plate (e.g., GJ 05 AB 1234)
  const plateRegex = /^[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{1,4}$/;

  const handleSubmit = async (type) => {
    const trimmedCarNumber = carNumber.toUpperCase().trim();

    if (!plateRegex.test(trimmedCarNumber)) {
      setError("Invalid vehicle number format! Use '05 AB 1234'.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    // Get JWT Token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit a complaint.");
      setLoading(false);
      return;
    }

    // Get User Location (Geolocation API)
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const requestBody = {
          plateNo: `${stateCode} ${trimmedCarNumber}`,
          latitude,
          longitude,
        };

        try {
          const url =
            type === "sms" ? "http://localhost:8080/user/sendSMS" : "http://localhost:8080/user/UrgentCall";

          const response = await axios.post(url, requestBody, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          alert(
            type === "sms"
              ? `📩 SMS Sent Successfully!`
              : `📞 Call Triggered Successfully!`
          );
        } catch (err) {
          setError(err.response?.data || "Failed to send request. Try again.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError("Failed to get location. Please enable GPS.");
        setLoading(false);
      }
    );
  };

  return (
    <div
      className={`service_container min-h-screen flex flex-col mt-18 items-center transition-colors duration-300 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Navbar with Animated Tabs */}
      <div className={`relative flex justify-center space-x-6 mt-10 rounded-lg py-3 w-50 shadow-md transition-colors duration-300 
        bg-opacity-90 backdrop-blur-md px-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {["sms", "call"].map((service) => (
          <motion.div
            key={service}
            onClick={() => setShowSlide(service)}
            className={`cursor-pointer relative px-6 py-2 rounded-lg transition duration-300 text-sm font-semibold
              ${showSlide === service ? "text-blue-600" : "text-gray-500"} `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {service.toUpperCase()}
            {showSlide === service && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Animated Content Change */}
      <motion.div
        className={`container mx-auto mt-12 max-w-3xl p-6 rounded-lg shadow-lg overflow-hidden
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={showSlide}
            initial={{ opacity: 0, x: showSlide === "sms" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: showSlide === "sms" ? -50 : 50 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-center">
              {showSlide === "sms" ? "📩 Drop an SMS" : "📞 Automated Call"}
            </h1>
            <hr className="my-4 border-gray-400" />

            <div
              className={`p-4 rounded-lg transition-all ${
                darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}
            >
              <h3 className="text-lg font-semibold">Instructions:</h3>
              <p className="mt-2">
                Enter the vehicle number in the correct format: <strong>XX 00 XX 0000</strong>.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">🚗 File a Complaint</h3>

              <div className="flex mt-4 items-center">
                {/* State Code Dropdown */}
                <motion.div
                  className={`relative flex items-center rounded-l-md h-10 ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  } border-r border-gray-400`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <select
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="p-2 appearance-none focus:outline-none h-10 bg-transparent text-inherit cursor-pointer"
                  >
                    {[
                      "AP", "AR", "AS", "BR", "CG", "CH", "DD", "DL", "GA", "GJ", "HP",
                      "HR", "JH", "JK", "KA", "KL", "LA", "LD", "MH", "ML", "MN", "MP",
                      "MZ", "NL", "OD", "PB", "PY", "RJ", "SK", "TN", "TR", "TS", "UP",
                      "UK", "WB",
                    ].map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Car Number Input */}
                <input
                  type="text"
                  value={carNumber}
                  onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
                  placeholder="05 AB 1234"
                  maxLength="10"
                  className={`w-full p-2 rounded-r-md focus:outline-none h-10 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 mt-2">{error}</p>}

              {/* Submit Button */}
              <motion.button
                onClick={() => handleSubmit(showSlide)}
                className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? "Processing..." : showSlide === "sms" ? "Send SMS" : "Call User"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}