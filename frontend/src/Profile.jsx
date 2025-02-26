import React, { useState } from "react";
import Sidebar from "./Sidebar";
import General from "./General";
import History from "./History";

export default function Profile({ darkMode }) {
    const [isGeneral, setIsGeneral] = useState(true);

    return (
        <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            {/* Sidebar Placeholder */}
            <div className="w-64 hidden md:block">
                <Sidebar darkMode={darkMode} isGeneral = { isGeneral } setIsGeneral={setIsGeneral} />
            </div>

            {isGeneral ? (
                <General darkMode={darkMode} />
            ) : (
                <History darkMode={darkMode} />
            )}
        </div>
    );
}