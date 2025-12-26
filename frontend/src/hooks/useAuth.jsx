import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧩 Auto-detect login via cookie (read directly from cookie)
  useEffect(() => {
    const mail = Cookies.get("user_mail");
    if (mail) {
      setUser({ email: mail, displayName: mail.split("@")[0] });
    }
    setLoading(false);
  }, []);

  // 🧠 Login function (final fixed version)
  const login = async (mail, password) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/login/",
        { mail, password },
        {
          withCredentials: true, // ✅ crucial for cookies
          maxRedirects: 0,       // ✅ prevents redirect loops
        }
      );

      console.log("🟢 Backend Response:", res);

      // ✅ Handle successful login
      if (res?.data?.message === "login successful") {
        Cookies.set("user_mail", mail, { expires: 0.5 }); // 12-hour session
        setUser({ email: mail, displayName: mail.split("@")[0] });
        return { success: true };
      }

      // ⚠️ Unexpected response
      return {
        success: false,
        message: res.data?.detail || "Unexpected response from server.",
      };
    } catch (err) {
      console.error("❌ Login error caught:", err);

      // 🔍 Detailed error handling
      if (err.response) {
        console.log("🔴 Error response:", err.response);
        return {
          success: false,
          message: err.response.data?.detail || "Invalid credentials.",
        };
      } else if (err.request) {
        console.log("🔴 No response received:", err.request);
        return { success: false, message: "No response from server." };
      } else {
        console.log("🔴 Unknown error:", err.message);
        return { success: false, message: "Server error. Please try again." };
      }
    }
  };

  // 🚪 Logout (clears cookie + state)
  const logout = async () => {
    try {
      // Call backend to clear HttpOnly cookie
      await axios.post("http://127.0.0.1:8000/logout/", {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local state regardless
      Cookies.remove("user_mail");
      setUser(null);
    }
  };

  const value = { user, login, logout, loading, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div
          style={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "linear-gradient(135deg, #3b82f6, #22c55e)",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div className="loader"></div>
          <h2 style={{ marginTop: "1rem" }}>Loading Student Sanctuary...</h2>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// 🔒 Protect routes for logged-in users only
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "linear-gradient(135deg, #3b82f6, #22c55e)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div className="loader"></div>
        <h2 style={{ marginTop: "1rem" }}>Verifying your session...</h2>
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
