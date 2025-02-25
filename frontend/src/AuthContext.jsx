import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true"; // Load from storage
    });
    
    const [accessReason, setAccessReason] = useState("");

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn); // Save state on change
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, accessReason, setAccessReason }}>
            {children}
        </AuthContext.Provider>
    );
}