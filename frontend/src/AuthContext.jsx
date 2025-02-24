import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessReason, setAccessReason] = useState("");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, accessReason, setAccessReason }}>
      {children}
    </AuthContext.Provider>
  );
};
