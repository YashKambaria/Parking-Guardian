import React from "react";

export default function Sidebar({ darkMode, isGeneral, setIsGeneral }) {
    return (
        <div className={`h-screen w-64 fixed top-0 mt-18 left-0 p-6 transition-colors duration-300 shadow-lg ${darkMode ? "bg-gray-900 text-white shadow-gray-800" : "bg-white text-gray-900 shadow-gray-400"}`}>
            <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
            
            <nav className="space-y-4">
                <SidebarButton label="General" onClick={() => setIsGeneral(true)} darkMode={darkMode} isActive={isGeneral} />
                <SidebarButton label="History" onClick={() => setIsGeneral(false)} darkMode={darkMode} isActive={!isGeneral} />
            </nav>
        </div>
    );
}

function SidebarButton({ label, onClick, darkMode, isActive }) {
    return (
        <button 
            onClick={onClick} 
            className={`block w-full px-4 py-2 rounded-lg transition text-left cursor-pointer 
            ${isActive ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-300 text-black") : ""} 
            ${darkMode ? "hover:bg-blue-800" : "hover:bg-blue-400"}`}
        >
            {label}
        </button>
    );
}