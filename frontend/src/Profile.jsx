import React from "react";
import Sidebar from "./Sidebar";
import General from "./General";

export default function Profile({ darkMode }) {

    return (
        <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            {/* Sidebar Placeholder */}
            <div className="w-64 hidden md:block">
                <Sidebar darkMode={ darkMode } />
            </div>
            <General darkMode={ darkMode }/>
        </div>
    );
}
