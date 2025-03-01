import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

  // Ensure loader is visible for at least 4 seconds
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // --- (Other functions remain unchanged) ---

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
      // alert("User information updated successfully!");
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

  // Show the loader card if data is still loading or minimum 4s hasn't elapsed
  if (!minLoadingDone || !userInfo.username) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md ${
          darkMode ? "bg-gray-900 bg-opacity-60" : "bg-white"
        }`}
      >
        <div className={`card ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <div className="loader">
            <p>loading</p>
            <div className="words">
              <span className="word">username</span>
              <span className="word">email</span>
              <span className="word">phone no</span>
              <span className="word">vehicles</span>
              <span className="word">username</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-6">Profile</h1>
        <div className={`p-6 rounded-lg shadow-lg mb-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">User Information</h2>
            <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="space-y-3">
            <p>
              <strong>Username:</strong>
              {isEditing ? (
                <input className="p-2 border rounded-md" value={userInfo.username} onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })} />
              ) : (
                " " + userInfo.username
              )}
            </p>
            <p className="flex items-center">
              <strong className="mr-2">Email:</strong>
              {isEditing ? (
                <input className="p-2 border rounded-md" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
              ) : (
                " " + userInfo.email
              )}
              {emailVerified ? (
                <i className="fa-regular fa-circle-check ml-2 text-green-600"></i>
              ) : (
                <button onClick={() => handleVerify("email")} className="ml-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                  Verify
                </button>
              )}
            </p>
            <p className="flex items-center">
              <strong className="mr-2">Phone:</strong>
              {isEditing ? (
                <input className="p-2 border rounded-md" value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />
              ) : (
                " " + userInfo.phone
              )}
              {phoneVerified ? (
                <i className="fa-regular fa-circle-check ml-2 text-green-600"></i>
              ) : (
                <button onClick={() => handleVerify("phone")} className="ml-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                  Verify
                </button>
              )}
            </p>
            <p>
              <strong>Password:</strong>
              {isEditing ? (
                <input className="p-2 border rounded-md" type="password" value={userInfo.password} onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })} />
              ) : (
                " ********"
              )}
            </p>
          </div>
          {isEditing && (
            <button onClick={handleUpdateUserInfo} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Update
            </button>
          )}
          {verifyingField && (
            <div className="mt-4">
              <p>Enter OTP sent to your {verifyingField}:</p>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="p-2 border rounded-md w-full mt-2" />
              <div className="flex space-x-2 mt-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={checkValidation}>
                  Verify
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={() => { setVerifyingField(null); setOtp(""); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Vehicles</h2>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
              + Add Vehicle
            </button>
          </div>
          <div className="space-y-4">
            {vehicles.map((vehicle, index) => (
              <div key={index} className={`flex justify-between items-center p-3 border rounded-md shadow-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <span className="font-medium">
                  {vehicle.plateNo} - {vehicle.carModel}
                </span>
                <button
                  onClick={() => handleDeleteClick(vehicle)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Confirmation Modal */}
          {deleteModal && (
            <div
              className={`fixed inset-0 bg-opacity-50 flex justify-center items-center ${
                darkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div
                className={`p-6 rounded-lg shadow-lg w-96 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                {selectedVehicle && (
                  <p className="mb-4">
                    Are you sure you want to delete{" "}
                    <b>{selectedVehicle.carModel}</b> with plate number{" "}
                    <b>{selectedVehicle.plateNo}</b>?
                  </p>
                )}
                <div className="flex justify-between">
                  <button
                    onClick={confirmDeleteVehicle}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* // </div> */}

      {showModal && (
        <div
          className={`fixed inset-0 bg-opacity-50 flex justify-center items-center ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div
            className={`p-6 rounded-lg shadow-lg w-96 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Add Vehicle</h2>
            <input
              type="text"
              placeholder="Plate Number"
              value={newPlate}
              onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
              className={`w-full p-2 mb-3 border rounded-md ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
            <input
              type="text"
              placeholder="Car Name"
              value={newCarName}
              onChange={(e) => setNewCarName(e.target.value)}
              className={`w-full p-2 mb-3 border rounded-md ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddVehicle}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}