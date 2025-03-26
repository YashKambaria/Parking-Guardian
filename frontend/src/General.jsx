import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function General({ darkMode }) {
  const [vehicles, setVehicles] = useState([]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [newCarName, setNewCarName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [otp, setOtp] = useState("");
  const [verifyingField, setVerifyingField] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();

  const originalUsernameRef = useRef(userInfo.username);

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteModal(true);
  };

  const confirmDeleteVehicle = async() => {
    try{
      const token=localStorage.getItem("token");
      if (selectedVehicle) {
        const response = await fetch("http://localhost:8080/user/deleteVehicle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedVehicle),
        });
        if(response.ok){
          alert(" Vehicle deleted successfully ");
          setVehicles((prevVehicles) =>
            prevVehicles.filter(
              (vehicle) => vehicle.plateNo !== selectedVehicle.plateNo
            )
          );
        }
        else if(response.status==401){
          alert(" Session Expired please login again ");
          navigate("/login");
        }
        else if(response.status==404){
          alert("Sorry, User is not associated with this vehicle please contact with admin ");
        }
      }
      setDeleteModal(false);
      setSelectedVehicle(null);
    }
    catch(error){
      alert("An Error occured please try again later");
      console.log(error);
    }
  };

  // Fetch user data from backend with token check
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Get JWT token
      try {
        const response = await fetch("http://localhost:8080/user/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          localStorage.setItem("isLoggedIn","false");
          localStorage.removeItem("token");
          alert("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        const data = await response.json();
        setUserInfo({
          username: data.username,
          email: data.email,
          phone: data.phoneNo,
        });
        setEmailVerified(data.emailVerified);
        setPhoneVerified(data.phoneVerified);
        setVehicles(data.vehicles || []);
      } catch (error) {
        localStorage.setItem("isLoggedIn","false");
        localStorage.removeItem("token");
        console.error("Error fetching user data:", error);
        alert("Unable to fetch data. Please log in again.");
        navigate("/login");
      }
    };
    fetchUserData();
  }, []);

  // Ensure loader is visible for at least 2.5 seconds
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddVehicle = async () => {
    if (!newPlate || !newCarName) return;
    const token = localStorage.getItem("token");
    const newVehicle = { plateNo: newPlate, carModel: newCarName };
    try {
      const response = await fetch("http://localhost:8080/user/addVehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVehicle),
      });
      if (!response.ok) {
        throw new Error("Failed to add vehicle");
      }
      setVehicles([...vehicles, newVehicle]);
      setNewPlate("");
      setNewCarName("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const handleUpdateUserInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/user/updateDetails", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userInfo.username,
          email: userInfo.email,
          phoneNo: userInfo.phone,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user information");
      }
      const updatedData = await response.json();
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        username: updatedData.username || prevUserInfo.username,
        email: updatedData.email || prevUserInfo.email,
        phone: updatedData.phoneNo || prevUserInfo.phone,
      }));
      if (
        updatedData.username &&
        updatedData.username !== originalUsernameRef.current
      ) {
        console.log("Username changed, fetching new token...");
        const newTokenResponse = await fetch(
          "http://localhost:8080/public/refresh-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: updatedData.username }),
          }
        );
        if (!newTokenResponse.ok) {
          throw new Error("Failed to refresh token after username update");
        }
        const newToken = await newTokenResponse.text();
        console.log("new token", newToken);
        localStorage.setItem("token", newToken);
        originalUsernameRef.current = updatedData.username;
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Failed to update user details. Please try again.");
    }
    window.location.reload(false);
  };

  const handleVerify = async (field) => {
    const token = localStorage.getItem("token");
    let url = "";
    if (field === "email") {
      url = "http://localhost:8080/user/sendOTPEmail";
    } else if (field === "phone") {
      url = "http://localhost:8080/user/sendOTPPhone";
    }
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.text();
      if (response.ok) {
        alert(result);
        if (field === "email") {
          setEmailVerified(false);
        } else if (field === "phone") {
          setPhoneVerified(false);
        }
      } else {
        alert(`Error: ${result}`);
      }
    } catch (error) {
      console.error(`Error verifying ${field}:`, error);
      alert("Something went wrong. Please try again.");
    }
    setVerifyingField(field);
  };

  const checkValidation = async () => {
    if (!verifyingField || !otp) {
      alert("Please enter OTP before verifying.");
      return;
    }
    const token = localStorage.getItem("token");
    let url = "";
    let body = { otp };
    if (verifyingField === "email") {
      url = "http://localhost:8080/user/verifyEmail";
    } else if (verifyingField === "phone") {
      url = "http://localhost:8080/user/verifyPhone";
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.text();
      console.log(JSON.stringify(response));
      if (response.ok) {
        alert(result);
        if (verifyingField === "email") {
          setEmailVerified(true);
        } else if (verifyingField === "phone") {
          setPhoneVerified(true);
        }
        setVerifyingField(null);
        setOtp("");
      } else {
        alert(`Error: ${result}`);
      }
    } catch (error) {
      console.error(`Error verifying ${verifyingField}:`, error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {}, [emailVerified, phoneVerified]);

  // Show the loader card if data is still loading or minimum time hasn't elapsed
  if (!minLoadingDone || !userInfo.username) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md ${
          darkMode ? "bg-gray-900 bg-opacity-60" : "bg-white bg-opacity-60"
        } transition-all duration-500`}
      >
        <div 
          className={`relative p-8 rounded-2xl shadow-2xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } overflow-hidden flex flex-col items-center justify-center`}
          style={{ width: "300px", height: "200px" }}
        >
          {/* New Text Animation Loader */}
          <div className="card" style={{ 
            backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'rgb(243, 244, 246)',
            boxShadow: darkMode ? '0 0 15px rgba(255, 255, 255, 0.1)' : '0 0 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="loader">
              <p>Loading</p>
              <div className="words">
                <span className="word">profile</span>
                <span className="word">details</span>
                <span className="word">vehicles</span>
                <span className="word">information</span>
                <span className="word">profile</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm opacity-75">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1"
    >
      {/* Main Content */}
      <div className="p-8 space-y-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight"
        >
          Profile
        </motion.h1>
        
        <AnimatePresence>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`p-8 rounded-xl shadow-xl mb-6 ${
              darkMode 
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-white border border-gray-100"
            } transform transition-all duration-300 hover:shadow-2xl`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <span className="mr-2">User Information</span>
                <span className={`inline-block w-2 h-2 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-500"} animate-pulse`}></span>
              </h2>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)} 
                className={`px-5 py-2.5 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? isEditing ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    : isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                } text-white font-medium shadow-md hover:shadow-lg flex items-center space-x-2`}
              >
                <span>{isEditing ? "Cancel" : "Edit"}</span>
                <span className="material-symbols-outlined text-sm">
                  {isEditing ? "close" : "edit"}
                </span>
              </motion.button>
            </div>
            
            <div className="space-y-5">
              <div className={`p-4 rounded-lg transition-all duration-300 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
              }`}>
                <p className="flex items-center">
                  <span className="w-28 font-medium">Username:</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="username-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`ml-2 p-2.5 rounded-md w-full max-w-xs ${
                          darkMode 
                            ? "bg-gray-800 border border-gray-600 text-white" 
                            : "bg-white border border-gray-300 text-black"
                        } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                        value={userInfo.username}
                        onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                      />
                    ) : (
                      <motion.span
                        key="username-text"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 text-lg"
                      >
                        {userInfo.username}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </p>
              </div>

              <div className={`p-4 rounded-lg transition-all duration-300 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
              }`}>
                <div className="flex items-center flex-wrap sm:flex-nowrap">
                  <span className="w-28 font-medium">Email:</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="email-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`ml-2 p-2.5 rounded-md w-full sm:max-w-xs ${
                          darkMode 
                            ? "bg-gray-800 border border-gray-600 text-white" 
                            : "bg-white border border-gray-300 text-black"
                        } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      />
                    ) : (
                      <motion.span
                        key="email-text"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 text-lg"
                      >
                        {userInfo.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <div className="ml-auto mt-2 sm:mt-0">
                    {emailVerified ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="flex items-center text-green-500 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </motion.div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerify("email")} 
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verify
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg transition-all duration-300 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
              }`}>
                <div className="flex items-center flex-wrap sm:flex-nowrap">
                  <span className="w-28 font-medium">Phone:</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="phone-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`ml-2 p-2.5 rounded-md w-full sm:max-w-xs ${
                          darkMode 
                            ? "bg-gray-800 border border-gray-600 text-white" 
                            : "bg-white border border-gray-300 text-black"
                        } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      />
                    ) : (
                      <motion.span
                        key="phone-text"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 text-lg"
                      >
                        {userInfo.phone}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <div className="ml-auto mt-2 sm:mt-0">
                    {phoneVerified ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="flex items-center text-green-500 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </motion.div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerify("phone")} 
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verify
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg transition-all duration-300 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
              }`}>
                <p className="flex items-center">
                  <span className="w-28 font-medium">Password:</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="password-input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`ml-2 p-2.5 rounded-md w-full max-w-xs ${
                          darkMode 
                            ? "bg-gray-800 border border-gray-600 text-white" 
                            : "bg-white border border-gray-300 text-black"
                        } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                        type="password"
                        value={userInfo.password || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                      />
                    ) : (
                      <motion.span
                        key="password-text"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 tracking-widest text-lg"
                      >
                        ********
                      </motion.span>
                    )}
                  </AnimatePresence>
                </p>
              </div>
            </div>
            
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUpdateUserInfo} 
                    className={`w-full px-6 py-3 flex justify-center items-center rounded-xl ${
                      darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                    } text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <span className="mr-2">Update Information</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {verifyingField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className={`p-5 rounded-xl ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } border-l-4 border-blue-500`}>
                    <h3 className="text-lg font-medium mb-3">
                      Verify your {verifyingField === "email" ? "email address" : "phone number"}
                    </h3>
                    <p className="mb-4 opacity-80">
                      Enter the OTP sent to your {verifyingField === "email" ? "email" : "phone"}:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)}
                        className={`p-3 text-lg text-center letter-spacing-1 rounded-lg w-full sm:max-w-[150px] border-2 ${
                          darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                        placeholder="Enter OTP"
                      />
                      <div className="flex gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={checkValidation} 
                          className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verify
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setVerifyingField(null); setOtp(""); }}
                          className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`p-8 rounded-xl shadow-xl ${
            darkMode 
              ? "bg-gray-800 text-white border border-gray-700" 
              : "bg-white border border-gray-100"
          } transform transition-all duration-300 hover:shadow-2xl`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <span className="mr-2">Vehicles</span>
              <span className={`inline-block w-2 h-2 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-500"} animate-pulse`}></span>
            </h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)} 
              className={`px-5 py-2.5 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-medium shadow-md hover:shadow-lg flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Vehicle
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`p-8 text-center rounded-lg border-2 border-dashed ${
                  darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="text-lg">No vehicles added yet</p>
                <p className="mt-2 text-sm">Click the "Add Vehicle" button to register your first vehicle</p>
              </motion.div>
            ) : (
              <div className="grid gap-4">
                {vehicles.map((vehicle, index) => (
                  <motion.div 
                    key={vehicle.plateNo}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className={`flex justify-between items-center p-5 border rounded-xl shadow-sm ${
                      darkMode ? "bg-gray-700 hover:bg-gray-650 border-gray-600" : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    } transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-lg">{vehicle.plateNo}</p>
                        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{vehicle.carModel}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteClick(vehicle)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
              darkMode 
                ? "bg-gray-900 bg-opacity-80 backdrop-blur-sm" 
                : "bg-gray-200 bg-opacity-75 backdrop-blur-sm"
            }`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`relative p-8 w-full max-w-md rounded-xl shadow-2xl ${
                darkMode 
                  ? "bg-gray-800 text-white border border-gray-700" 
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <div className="text-center mb-6">
                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 ${darkMode ? "bg-red-900" : "bg-red-100"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${darkMode ? "text-red-500" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Confirm Deletion</h2>
                {selectedVehicle && (
                  <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Are you sure you want to delete <br />
                    <span className="font-semibold inline-block mt-2">{selectedVehicle.carModel}</span> with plate number <br />
                    <span className={`font-bold text-lg mt-1 inline-block ${darkMode ? "text-red-400" : "text-red-600"}`}>{selectedVehicle.plateNo}</span>?
                  </p>
                )}
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDeleteModal(false)}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } transition-all duration-200`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmDeleteVehicle}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
              darkMode 
                ? "bg-gray-900 bg-opacity-80 backdrop-blur-sm" 
                : "bg-gray-200 bg-opacity-75 backdrop-blur-sm"
            }`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`relative p-8 w-full max-w-md rounded-xl shadow-2xl ${
                darkMode 
                  ? "bg-gray-800 text-white border border-gray-700" 
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <div className="text-center mb-6">
                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 ${darkMode ? "bg-blue-900" : "bg-blue-100"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${darkMode ? "text-blue-500" : "text-blue-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Add New Vehicle</h2>
                <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Enter your vehicle details below
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Plate Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AB123XY"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-black"
                    } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Car Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Toyota Camry"
                    value={newCarName}
                    onChange={(e) => setNewCarName(e.target.value)}
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-black"
                    } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } transition-all duration-200`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddVehicle}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Add Vehicle
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}