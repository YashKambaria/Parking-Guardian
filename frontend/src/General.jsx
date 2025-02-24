import React, { useEffect, useState } from "react";

export default function General({ darkMode }) {
    const [vehicles, setVehicles] = useState([
        { plate: "GJ01AB1234", name: "Honda City" }
    ]);
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newPlate, setNewPlate] = useState("");
    const [newCarName, setNewCarName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "johndoe",
        email: "johndoe@example.com",
        phone: "+91 98765 43210",
        password: "********"
    });
    const [otp, setOtp] = useState("");
    const [verifyingField, setVerifyingField] = useState(null);

    const handleAddVehicle = () => {
        if (!newPlate || !newCarName) return;
        setVehicles([...vehicles, { plate: newPlate, name: newCarName }]);
        setNewPlate("");
        setNewCarName("");
        setShowModal(false);
    };

    const handleUpdateUserInfo = () => {
        setIsEditing(false);
    };

    const handleVerify = (field) => {
        setVerifyingField(field);
    };

    const checkValidation = () => {
        if (verifyingField === "email") setEmailVerified(true);
        else if (verifyingField === "phone") setPhoneVerified(true);
        setVerifyingField(null); // Reset after verification
    };

    useEffect(() => {}, [emailVerified, phoneVerified]); // Watch for state changes

    return (
        <>
            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-bold mb-6">Profile</h1>
                
                {/* User Info Section */}
                <div className={`p-6 rounded-lg shadow-lg mb-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">User Information</h2>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>
                    <div className="space-y-3">
                        <p>
                            <strong>Username:</strong>
                            {isEditing ? (
                                <input className="p-2 border rounded-md" value={userInfo.username} onChange={(e) => setUserInfo({...userInfo, username: e.target.value})} />
                            ) : (
                                " " + userInfo.username
                            )}
                        </p>

                        <p className="flex items-center">
                            <strong className="mr-2">Email:</strong>
                            {isEditing ? (
                                <input className="p-2 border rounded-md" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} />
                            ) : (
                                " " + userInfo.email
                            )}

                            {emailVerified ? (
                                <i className="fa-regular fa-circle-check ml-2 text-green-600"></i>
                            ) : (
                                <button 
                                    onClick={() => handleVerify("email")} 
                                    className="ml-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                                >
                                    Verify
                                </button>
                            )}
                        </p>

                        <p className="flex items-center">
                            <strong className="mr-2">Phone:</strong> 
                            {isEditing ? (
                                <input className="p-2 border rounded-md" value={userInfo.phone} onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})} />
                            ) : (
                                " " + userInfo.phone
                            )} 

                            {phoneVerified ? (
                                <i className="fa-regular fa-circle-check ml-2 text-green-600"></i>
                            ) : (
                                <button 
                                    onClick={() => handleVerify("phone")} 
                                    className="ml-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                                >
                                    Verify
                                </button>
                            )}
                        </p>

                        <p>
                            <strong>Password:</strong> 
                            {isEditing ? (
                                <input className="p-2 border rounded-md" type="password" value={userInfo.password} onChange={(e) => setUserInfo({...userInfo, password: e.target.value})} />
                            ) : (
                                " ********"
                            )}
                        </p>
                    </div>
                    {isEditing && (
                        <button 
                            onClick={handleUpdateUserInfo} 
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Update
                        </button>
                    )}
                    {verifyingField && (
                        <div className="mt-4">
                            <p>Enter OTP sent to your {verifyingField}:</p>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                className="p-2 border rounded-md w-full mt-2" 
                            />
                            <button 
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" 
                                onClick={checkValidation}
                            >
                                Verify
                            </button>
                        </div>
                    )}
                </div>

                {/* Vehicles Section */}
                <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Vehicles</h2>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            + Add Vehicle
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {vehicles.map((vehicle, index) => (
                            <div key={index} className={`flex justify-between items-center p-3 border rounded-md shadow-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                <span className="font-medium">{vehicle.plate} - {vehicle.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Vehicle Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                        <h2 className="text-xl font-semibold mb-4">Add Vehicle</h2>
                        
                        <input 
                            type="text" 
                            placeholder="Plate Number" 
                            value={newPlate}
                            onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                            className="w-full p-2 mb-3 border rounded-md"
                        />

                        <input 
                            type="text" 
                            placeholder="Car Name" 
                            value={newCarName}
                            onChange={(e) => setNewCarName(e.target.value)}
                            className="w-full p-2 mb-3 border rounded-md"
                        />
                        
                        <div className="flex justify-between">
                            <button onClick={handleAddVehicle} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add</button>
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
