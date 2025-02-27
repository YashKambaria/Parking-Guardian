import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Service({ darkMode }) {
  const [stateCode, setStateCode] = useState("GJ");
  const [carNumber, setCarNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSlide, setShowSlide] = useState("sms");
  const [alertMessage, setAlertMessage] = useState(null); // Alert state

  // Progress-related states
  const [progress, setProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState("Please wait...");

  // Dark mode pre-loading
  const [isDarkModeLoaded, setIsDarkModeLoaded] = useState(false);
  useLayoutEffect(() => {
    setIsDarkModeLoaded(true);
  }, []);

  // Animate the progress bar whenever loading is true
  useEffect(() => {
    let interval1, interval2;
    if (loading) {
      setProgress(0);
      setLoaderMessage("Please wait...");

      let current = 0;
      interval1 = setInterval(() => {
        current += 1;
        setProgress(current);
        if (current >= 80) {
          clearInterval(interval1);
          interval2 = setInterval(() => {
            current += 1;
            setProgress(current);
            if (current >= 90) {
              clearInterval(interval2);
            }
          }, 500);
        }
      }, 100);
    } else {
      setProgress(0);
    }
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [loading]);

  // Plate number validation
  const plateRegex = /^[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{1,4}$/;

  const handleCarNumberChange = async (e) => {
    if (e.target.value.toUpperCase().includes(" ")) {
      setError("Car number cannot contain spaces");
      setCarNumber(e.target.value.toUpperCase());
    } else {
      setError("");
      setCarNumber(e.target.value.toUpperCase());
    }
  };

  const handleSubmit = async (type) => {
    const trimmedCarNumber = carNumber.toUpperCase().trim();
    if (!plateRegex.test(trimmedCarNumber)) {
      setError("Invalid vehicle number format! Use '05 AB 1234'.");
      return;
    }
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit a complaint.");
      setLoading(false);
      return;
    }
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
            type === "sms"
              ? "http://localhost:8080/userServices/sendSMS"
              : "http://localhost:8080/userServices/UrgentCall";
          const data = await axios.post(url, requestBody, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          console.log(JSON.stringify(data));
          if (data.status >= 200 && data.status < 300) {
            setProgress(100);
            setLoaderMessage("Request completed");
            setTimeout(() => {
              setLoading(false);
              setAlertMessage(
                type === "sms"
                  ? "📩 SMS Sent Successfully!"
                  : "📞 Call Triggered Successfully!"
              );
              setTimeout(() => {
                setAlertMessage(null);
              }, 3000);
            }, 3000);
          } else {
            setLoading(false);
            const result = await data.text();
            alert(`Error: ${result}`);
          }
        } catch (err) {
          setLoading(false);
          setError(err.response?.data || "Failed to send request. Try again.");
        }
      },
      () => {
        setLoading(false);
        setError("Failed to get location. Please enable GPS.");
      }
    );
  };

  if (!isDarkModeLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`service_container min-h-screen flex flex-col mt-18 items-center transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-center z-50"
          >
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`relative flex justify-center space-x-6 mt-10 rounded-lg py-3 w-50 shadow-md transition-colors duration-300 bg-opacity-90 backdrop-blur-md px-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {["sms", "call"].map((service) => (
          <motion.div
            key={service}
            onClick={() => setShowSlide(service)}
            className={`cursor-pointer relative px-6 py-2 rounded-lg transition duration-300 text-sm font-semibold ${
              showSlide === service ? "text-blue-600" : "text-gray-500"
            } `}
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

      <motion.div
        className={`container mx-auto mt-12 max-w-3xl p-6 rounded-lg shadow-lg overflow-hidden ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
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
                darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <h3 className="text-lg font-semibold">Instructions:</h3>
              <p className="mt-2">
                Enter the vehicle number in the correct format:{" "}
                <strong>XX 00 XX 0000</strong>.
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">🚗 File a Complaint</h3>
              <div className="flex mt-4 items-center">
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
                      "AP","AR","AS","BR","CG","CH","DD","DL","GA","GJ","HP","HR","JH","JK","KA","KL","LA","LD","MH","ML","MN","MP","MZ","NL","OD","PB","PY","RJ","SK","TN","TR","TS","UP","UK","WB",
                    ].map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <input
                  type="text"
                  value={carNumber}
                  onChange={(e) => handleCarNumberChange(e)}
                  placeholder="05AB1234"
                  maxLength="10"
                  className={`w-full p-2 rounded-r-md focus:outline-none h-10 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                />
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <motion.button
                onClick={() => handleSubmit(showSlide)}
                className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : showSlide === "sms"
                  ? "Send SMS"
                  : "Call User"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Loader Overlay */}
      {loading && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
            darkMode ? "bg-gray-900 bg-opacity-60" : "bg-white"
          }`}
        >
          <div className={`wrapper ${darkMode ? "dark" : "light"}`}>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
          </div>
          <p
            className={`mt-4 text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {loaderMessage}
          </p>
          {loaderMessage === "Please wait..." && (
            <p className={darkMode ? "text-white" : "text-gray-900"}>
              We are processing your request
            </p>
          )}
        </div>
      )}
    </div>
  );
}
