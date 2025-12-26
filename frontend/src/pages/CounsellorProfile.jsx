import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCounsellorProfile, counsellorLogout, getCounsellorEmail } from "../services/counsellorApi";
import "../styles/counsellor.css";

export default function CounsellorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const counsellorEmail = getCounsellorEmail();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getCounsellorProfile();
      if (response.data?.details) {
        setProfile(response.data.details);
      } else if (response.data) {
        setProfile(response.data);
      } else {
        setError("Unable to load profile data.");
      }
    } catch (err) {
      console.error("Error fetching counsellor profile:", err);
      setError("Failed to load your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await counsellorLogout();
      toast.success("Logged out successfully");
      navigate("/counsellor/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleBackToDashboard = () => {
    navigate("/counsellor/dashboard");
  };

  if (isLoading) {
    return (
      <div className="counsellor-container">
        <div className="counsellor-loading">
          <div className="counsellor-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="counsellor-container">
        <div className="counsellor-error-card">
          <div className="counsellor-error-icon-small">⚠️</div>
          <div>
            <h3 className="counsellor-error-title-small">Error</h3>
            <p className="counsellor-error-text-small">{error}</p>
          </div>
        </div>
        <button onClick={handleBackToDashboard} className="counsellor-btn counsellor-btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="counsellor-container">
      <div className="counsellor-header-section">
        <button 
          onClick={handleBackToDashboard} 
          className="counsellor-back-btn"
        >
          ← Back to Dashboard
        </button>
        <h1 className="counsellor-page-title">Counsellor Profile</h1>
      </div>

      <div className="counsellor-profile-card">
        <div className="counsellor-profile-header">
          <div className="counsellor-profile-avatar">
            {profile?.name?.charAt(0) || "C"}
          </div>
          <div className="counsellor-profile-info">
            <h2 className="counsellor-profile-name">{profile?.name || "Counsellor"}</h2>
            <p className="counsellor-profile-email">{profile?.mail || counsellorEmail}</p>
          </div>
        </div>

        <div className="counsellor-profile-details">
          <div className="counsellor-profile-row">
            <div className="counsellor-profile-field">
              <label>Email</label>
              <p>{profile?.mail || counsellorEmail || "-"}</p>
            </div>
            <div className="counsellor-profile-field">
              <label>Name</label>
              <p>{profile?.name || "-"}</p>
            </div>
          </div>

          <div className="counsellor-profile-row">
            <div className="counsellor-profile-field">
              <label>Phone</label>
              <p>{profile?.phone || "-"}</p>
            </div>
            <div className="counsellor-profile-field">
              <label>Specialization</label>
              <p>{profile?.specialization || "-"}</p>
            </div>
          </div>

          <div className="counsellor-profile-row">
            <div className="counsellor-profile-field">
              <label>Experience</label>
              <p>{profile?.experience ? `${profile.experience} years` : "-"}</p>
            </div>
            <div className="counsellor-profile-field">
              <label>Department</label>
              <p>{profile?.department || "-"}</p>
            </div>
          </div>
        </div>

        <div className="counsellor-profile-actions">
          <button 
            onClick={handleBackToDashboard}
            className="counsellor-btn counsellor-btn-secondary"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={handleLogout}
            className="counsellor-btn counsellor-btn-danger"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
