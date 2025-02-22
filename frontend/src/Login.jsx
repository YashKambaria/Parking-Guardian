import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        // Basic validation
        if (!username || !password) {
            setError("Username and password are required!");
            return;
        }

        try {
            // Mock JWT token (Replace with actual API call in real apps)
            const fakeJWT = btoa(JSON.stringify({ user: username, exp: Date.now() + 3600000 })); // Expiry: 1 hour
            localStorage.setItem("token", fakeJWT);

            alert("Login Successful!");
            window.location.href = "/"; // Redirect to home page
        } catch (err) {
            setError("Login failed. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-xl rounded-lg w-96">
                <h2 className="text-3xl font-bold text-center mb-4 text-blue-600">Login</h2>

                {/* Username Input */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block border p-2 w-full rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
                />

                {/* Password Input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block border p-2 w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-400"
                />

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                {/* Login Button */}
                <button 
                    onClick={handleLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition-all"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
