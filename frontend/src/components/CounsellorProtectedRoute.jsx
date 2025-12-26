import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getCounsellorProfile } from "../services/counsellorApi";
import "../styles/counsellor.css";

export function CounsellorProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Since cookie is HttpOnly, check auth by making a lightweight API call to profile endpoint
    const checkAuth = async () => {
      try {
        // This endpoint returns 401 if not authenticated, 200 if authenticated
        await getCounsellorProfile();
        setIsAuthenticated(true);
      } catch (error) {
        // 401 means not authenticated, any other error also means not authenticated
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="counsellor-container">
        <div className="counsellor-loading">
          <div className="counsellor-spinner"></div>
          <p>Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/counsellor/login" replace />;
  }

  return children;
}

