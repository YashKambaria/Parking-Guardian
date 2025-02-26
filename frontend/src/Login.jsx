import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export default function Login() {
    const { accessReason } = useContext(AuthContext);
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    let alertBox = "";
    useEffect(() => {
        if (accessReason == "!login") {
            alertBox = (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-fit max-w-lg bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center justify-between animate-fade-in">
                    <span className="font-semibold">You need to login first!</span>
                    <button 
                        className="ml-4 bg-red-800 px-2 py-1 rounded-md hover:bg-red-700 transition"
                        onClick={() => setError("")}
                    >
                        ✖
                    </button>
                </div>
            );
        }
    }, [accessReason]);

    const handleLogin = async () => {
        setError("");

        // Basic validation
        if (!username || !password) {
            setError("Username and password are required!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/public/login",
                { username, password },
                {
                    headers: { "Content-Type": "application/json" },
                    responseType: "text",
                }
            );

            console.log("The response: " + JSON.stringify(response));
            const token = response.data;

            if (response.status == 200) {
                setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", "true"); 
                localStorage.setItem("token", token);
                alert("Login successful");
                navigate("/");
            } else {
                alert("Login failed");
            }
        } catch (err) {
            setError(err.response?.data || "Login failed. Try again.");
        }
    };

    return (
        <>
            {alertBox}
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500">
                <div className="p-8 bg-white shadow-xl rounded-lg w-96">
                    <h2 className="text-3xl font-bold text-center mb-4 text-blue-600">Login</h2>

                    {/* Username Input */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block border p-2 w-full rounded-md mb-2 focus:ring-2 focus:ring-blue-400 text-black"
                    />

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block border p-2 w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-400 text-black"
                    />

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                    {/* Login Button */}
                    <button 
                        onClick={handleLogin}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition-all cursor-pointer"
                    >
                        Login
                    </button>

                    {/* Signup Link */}
                    <p className="text-center text-sm mt-3 text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
