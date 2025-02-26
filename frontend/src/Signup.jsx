import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export default function Signup() {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNumber] = useState("");
    const [carModel, setCarModel] = useState("");
    const [plateNo, setPlateNo] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");


    const handleSignup = async () => {
        setError("");

        // Regex patterns
        const emailRegex = /^\S+@\S+\.\S+$/;
        const phoneRegex = /^(?:\+?\d{1,3}[-.\s]?)?[6-9]\d{9}$/;
        const carModelRegex = /^[a-zA-Z0-9 ]+$/;
        const carPlateRegex = /^[A-Z]{2}\s\d{1,2}[A-Z]{1,3}\d{4}$/;

        if (!username || !email || !phoneNo || !carModel || !plateNo || !password || !confirmPassword) {
            setError("All fields are required!");
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Invalid email format!");
            return;
        }

        if (!phoneRegex.test(phoneNo)) {
            setError("Invalid phone number!");
            return;
        }

        if (!carModelRegex.test(carModel)) {
            setError("Invalid car model!");
            return;
        }

        if (!carPlateRegex.test(plateNo.toUpperCase())) {
            setError("Invalid car number plate format!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        const newVehicles = [{ carModel: carModel, plateNo: plateNo }];

        try {
            const response = await axios.post(
                "http://localhost:8080/public/sign-up",
                { username, email, phoneNo, vehicles: newVehicles, password },
                { headers: { "Content-Type": "application/json" }, responseType: "text" }
            );

            if (response.status === 201) {
                alert("Signup successful! Please login.");
                navigate("/login");
            } else {
                setError("Signup failed. Try again.");
            }
        } catch (err) {
            setError(err.response?.data || "Signup failed. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="p-8 bg-white shadow-2xl rounded-lg w-96">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Sign Up</h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                {[
                    { icon: "fa-user", type: "text", placeholder: "Username", state: username, setState: setUsername },
                    { icon: "fa-envelope", type: "email", placeholder: "Email ID", state: email, setState: setEmail },
                    { icon: "fa-phone", type: "text", placeholder: "Phone Number", state: phoneNo, setState: setPhoneNumber },
                    { icon: "fa-car", type: "text", placeholder: "Car Model", state: carModel, setState: setCarModel },
                    { icon: "fa-id-card", type: "text", placeholder: "Car Number Plate", state: plateNo, setState: setPlateNo },
                    { icon: "fa-lock", type: "password", placeholder: "Password", state: password, setState: setPassword },
                    { icon: "fa-lock", type: "password", placeholder: "Confirm Password", state: confirmPassword, setState: setConfirmPassword }
                ].map(({ icon, type, placeholder, state, setState }, index) => (
                    <div key={index} className="relative mb-3">
                        <i className={`fas ${icon} absolute left-3 top-3 text-gray-500`}></i>
                        <input
                            type={type}
                            placeholder={placeholder}
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="block pl-10 border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                        />
                    </div>
                ))}

                <button onClick={handleSignup} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition-all">
                    Sign Up
                </button>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline cursor-pointer">Login</Link>
                </p>
            </div>
        </div>
    );
}
