import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import General from "./General";
import History from "./History";

export default function Profile({ darkMode }) {
  const [isGeneral, setIsGeneral] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/user/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <Sidebar darkMode={darkMode} isGeneral={isGeneral} setIsGeneral={setIsGeneral} />
      </div>

      {isGeneral ? (
        <General darkMode={darkMode} userData={userData} />
      ) : (
        // Pass the history array if available, or an empty array otherwise
        <History darkMode={darkMode} historyData={userData ? userData.history : []} />
      )}
    </div>
  );
}
