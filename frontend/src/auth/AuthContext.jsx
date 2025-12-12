import React, { createContext, useState, useEffect, useContext } from "react";

// Named export so other files can import { AuthContext }
export const AuthContext = createContext(null);

// Provider component
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("sb_token"));
  const [user, setUser] = useState(() =>
    localStorage.getItem("sb_user")
      ? JSON.parse(localStorage.getItem("sb_user"))
      : null
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("sb_token", token);
    } else {
      localStorage.removeItem("sb_token");
    }

    if (user) {
      localStorage.setItem("sb_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("sb_user");
    }
  }, [token, user]);

  const login = (jwt, userdata) => {
    setToken(jwt);
    setUser(userdata);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for accessing AuthContext easier
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// Default export for compatibility
export default AuthContext;
