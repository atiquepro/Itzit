import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          console.error("Error fetching user after Google login", err);
        });
    } else {
      // If token already exists, check user
      const token = localStorage.getItem("token");
      if (token) {
        fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              setUser(data.user);
            } else {
              localStorage.removeItem("token");
            }
          })
          .catch((err) => {
            console.error("Error validating token", err);
          });
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithGoogle = () => {
    console.log("Redirecting to Google...");
    window.location.href = "http://localhost:5000/api/auth/google-login"; // Correct redirect

  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
