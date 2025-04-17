import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const fetchUser = async (token) => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.user) {
          setUser(data.user);
          if (params.get("token")) navigate("/dashboard");
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Error validating token", err);
        localStorage.removeItem("token");
      }
    };

    if (token) {
      localStorage.setItem("token", token);
      fetchUser(token);
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) fetchUser(storedToken);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data?.message || "Login failed", error);
    }
  };

  const loginWithGoogle = () => {
    console.log("Redirecting to Google...");
    window.location.href = "http://localhost:5000/api/auth/google-login";
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
