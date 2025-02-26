import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Service from "./Service";
import Login from "./Login"; // Import the Login component
import { AuthProvider } from "./AuthContext";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "./Signup";

export default function App() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <AuthProvider>
        <Router>
            <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-900 min-h-screen"}>
                
                {/* Show Navbar on all pages except Login */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    <Route path="*" element={
                        <>
                            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                            <div>
                                <Routes>
                                    <Route path="/" element={<Home darkMode={darkMode} />} />
                                    <Route
                                        path="/service"
                                        element={<ProtectedRoute><Service darkMode={darkMode} /></ProtectedRoute>}
                                    />

                                    {/* Protected Profile Route */}
                                    <Route 
                                        path="/profile" 
                                        element={<ProtectedRoute><Profile darkMode={darkMode} /></ProtectedRoute>} 
                                    />

                                    <Route path="*" element={<h1 className="text-center text-2xl mt-10">404 - Page Not Found</h1>} />
                                </Routes>
                            </div>
                        </>
                    } />
                </Routes>
            </div>
        </Router>
        </AuthProvider>
    );
}
