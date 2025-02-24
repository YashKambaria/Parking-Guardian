import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ darkMode }) {
    const location = useLocation();

    return (
        <div className={`h-screen w-64 fixed top-0 mt-18 left-0 p-6 transition-colors duration-300 shadow-lg ${darkMode ? "bg-gray-900 text-white shadow-gray-800" : "bg-white text-gray-900 shadow-gray-400"}`}>
            <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
            
            <nav className="space-y-4">
                <SidebarLink to="/profile" label="General" location={location.pathname} darkMode={darkMode} />
                <SidebarLink to="/history" label="History" location={location.pathname} darkMode={darkMode} />
            </nav>
        </div>
    );
}

const SidebarLink = ({ to, label, location, darkMode }) => {
    const isActive = location === to;

    return (
        <Link 
            to={to} 
            className={`block px-4 py-2 rounded-lg transition ${isActive 
                ? "bg-blue-600 text-white" 
                : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
        >
            {label}
        </Link>
    );
};
