import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {

    const [loggedIn, setLoggedIn] = useState(true);

  return (
    <nav className={`p-4 shadow-lg w-full fixed top-0 left-0 transition-colors z-50 duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-xl font-bold">Parking Guardian</a>
        
        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}
          />
          <span className={`absolute inset-y-0 right-3 flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            🔍
          </span>
        </div>
        
        {/* Navigation Links */}
        <div className="space-x-6 flex items-center">

            { loggedIn ? (
                <>
                    <Link to={`/`} className="hover:text-blue-400 cursor-pointer">Home</Link>
                    <Link to={`/service`} className="hover:text-blue-400 cursor-pointer">Service</Link>
                    <button className="hover:text-blue-400 cursor-pointer" onClick={() => setLoggedIn(false)}>Logout</button>
                </>
            ) : (
                <>
                    <Link to={`/login`} className="hover:text-blue-400 cursor-pointer">Login</Link>
                    <Link to={`/signup`} className="hover:text-blue-400 cursor-pointer">Sign Up</Link>
                </>
            ) }
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-gray-500 hover:border-blue-500 cursor-pointer"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
