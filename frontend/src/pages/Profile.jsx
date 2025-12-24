// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setErrMsg("");

        // ✅ USE localhost (same domain as cookie)
        const res = await axios.get("http://localhost:8000/profile/", {
          withCredentials: true,
        });

        if (!cancelled) setProfile(res.data.profile);
      } catch (err) {
        const status = err?.response?.status;
        console.error("❌ Profile fetch error:", err);

        // ✅ DO NOT AUTO LOGOUT
        if (status === 401) {
          if (!cancelled) {
            setErrMsg("Your session has expired. Please log in again.");
          }
          return;
        }

        if (!cancelled) {
          setErrMsg(
            err?.response?.data?.detail ||
              "Couldn't load your profile. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "linear-gradient(135deg, #3b82f6, #22c55e)",
          color: "#fff",
        }}
      >
        <h2>Loading your profile...</h2>
      </div>
    );
  }

  if (errMsg || !profile) {
    return (
      <section className="section">
        <div className="container text-center" style={{ maxWidth: 640 }}>
          <h2>Profile</h2>
          <p>{errMsg}</p>
          <button className="btn" onClick={logout}>
            Log out
          </button>
        </div>
      </section>
    );
  }

  const fmt = (v) => v ?? "-";
  const fmtDOB = (v) => (v ? new Date(v).toLocaleDateString() : "-");

  return (
    <section className="section">
      <div
        className="container"
        style={{
          maxWidth: 720,
          marginTop: "2rem",
          background: "#f9fafb",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2563eb" }}>
          👤 Student Profile
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <p><strong>Name:</strong> {fmt(profile.name)}</p>
          <p><strong>Email:</strong> {fmt(profile.mail)}</p>
          <p><strong>Age:</strong> {fmt(profile.age)}</p>
          <p><strong>Gender:</strong> {fmt(profile.gender)}</p>
          <p><strong>DOB:</strong> {fmtDOB(profile.dob)}</p>
          <p><strong>Place:</strong> {fmt(profile.place)}</p>
          <p><strong>Phone:</strong> {fmt(profile.phone)}</p>
          <p><strong>Education:</strong> {fmt(profile.education)}</p>
          <p><strong>Institution:</strong> {fmt(profile.institution)}</p>
        </div>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Link to="/appointments" className="btn">
            📅 Book Appointment
          </Link>
          <button className="btn" onClick={logout}>
            🚪 Log Out
          </button>
        </div>
      </div>
    </section>
  );
}
