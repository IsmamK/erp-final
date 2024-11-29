import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();


export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl.replace("/api","")

  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [authToken, user]);

  const login = async (username, password, navigate) => {
    const response = await fetch(`${baseUrl}/auth/token/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.auth_token);
      setUser(data.user);
      // Redirect based on the user's role
 
    navigate("/");
      
    } else {
      console.error("Login failed");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/token/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login"); // Navigate to login after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
