import { useState, useContext, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function Navbar({ darkMode, setDarkMode }) {
  // New state to track if dark mode has been loaded
  const [isDarkModeLoaded, setIsDarkModeLoaded] = useState(false);

  // Initialize dark mode from localStorage on mount synchronously
  useLayoutEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
    setIsDarkModeLoaded(true); // Dark mode is now loaded
  }, [setDarkMode]);

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  // Show loader until dark mode is determined
  if (!isDarkModeLoaded) {
    return (
      <div className="fixed inset-0 flex z-[200] items-center justify-center bg-white dark:bg-gray-900" style={{position: 'relative'}}>
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
    <nav
      className={`p-4 shadow-lg w-full fixed top-0 left-0 transition-colors z-50 duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="text-xl font-bold">
          <i className="fa-solid fa-dna mr-2 text-2xl"></i>
          Parking Guardian
        </Link>

        {/* Search Bar */}
        {/* <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
            }`}
          />
          <span
            className={`absolute inset-y-0 right-3 flex items-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            🔍
          </span>
        </div> */}

        {/* Navigation Links */}
        <div className="space-x-6 flex items-center">
          {isLoggedIn ? (
            <>
              <Link to={`/`} className="hover:text-blue-400 cursor-pointer">
                Home
              </Link>
              <Link to={`/service`} className="hover:text-blue-400 cursor-pointer">
                Service
              </Link>
              <button
                className="hover:text-blue-400 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={`/service`} className="hover:text-blue-400 cursor-pointer">
                Service
              </Link>
              <Link to={`/login`} className="hover:text-blue-400 cursor-pointer">
                Login
              </Link>
              <Link to={`/signup`} className="hover:text-blue-400 cursor-pointer">
                Sign Up
              </Link>
            </>
          )}

          {/* Orange Circle Toggle */}
          <label htmlFor="switch" className="cursor-pointer flex items-center">
            <input
              id="switch"
              type="checkbox"
              className="hidden"
              checked={darkMode}
              onChange={() => {
                if (darkMode) {
                  localStorage.setItem("darkMode", "false");
                  setDarkMode(false);
                } else {
                  localStorage.setItem("darkMode", "true");
                  setDarkMode(true);
                }
              }}
            />
            <div className="circle relative w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center transition-transform duration-300">
              <div className="crescent absolute w-10 h-10 bg-white rounded-full transform transition-transform duration-300"></div>
            </div>
          </label>

          {isLoggedIn && (
            <Link
              to={`/profile`}
              className="p-2 rounded-lg border border-gray-500 flex items-center justify-center hover:border-blue-500 cursor-pointer w-10 h-10"
            >
              <i className="fa-solid fa-user"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
