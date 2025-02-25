import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn, setAccessReason } = useContext(AuthContext);

    if (!isLoggedIn && localStorage.getItem("isLoggedIn") !== "true") {
        setAccessReason("!login"); // Set illegal access reason
        return <Navigate to="/login" replace />;
    }
    return children;
}