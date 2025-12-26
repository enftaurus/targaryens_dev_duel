import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCounsellorDashboard, counsellorLogout, getCounsellorEmail } from "../services/counsellorApi";

export default function CounsellorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const counsellorEmail = getCounsellorEmail();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getCounsellorDashboard();
        setAppointments(response.data.appointments || response.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching appointments:", err);
        if (err.response?.status === 404) {
          setAppointments([]);
          setError("");
        } else if (err.response?.status !== 401) {
          setError("Unable to load appointments. Please try again.");
          setAppointments([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleLogout = async () => {
    try {
      await counsellorLogout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/", { replace: true });
    }
  };

  const handleAppointmentClick = (studentEmail) => {
    if (studentEmail) {
      navigate(`/counsellor/dashboard/${encodeURIComponent(studentEmail)}`);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not specified";
    try {
      // Handle time-only strings
      if (typeof timeString === 'string' && timeString.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
      }
      
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="section">
      <div
        style={{
          maxWidth: "100%",
          width: "100%",
          minHeight: "100vh",
          background: "#fff5f0",
          padding: "2rem 3rem",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ color: "#ff6b35", margin: 0, fontSize: "2rem" }}>❤️ Counsellor Dashboard</h2>
            <p style={{ color: "#6b7280", margin: "0.5rem 0 0 0" }}>{counsellorEmail || "Counsellor"}</p>
          </div>
          <button onClick={handleLogout} className="btn" style={{ background: "#ff6b35", color: "#fff", border: "none" }}>
            🚪 Sign Out
          </button>
        </div>

        {/* Date Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#ff6b35", fontSize: "1.5rem" }}>📅 Today's Appointments</h3>
          <p style={{ color: "#6b7280" }}>{today}</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p>Loading appointments...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div style={{ background: "#fee2e2", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1rem" }}>
            <p style={{ color: "#991b1b", margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && appointments.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "0.75rem" }}>
            <p style={{ fontSize: "3rem", margin: 0 }}>📅</p>
            <h3 style={{ color: "#1f2937", marginTop: "1rem" }}>No Appointments Today</h3>
            <p style={{ color: "#6b7280" }}>You have no scheduled appointments for today.</p>
          </div>
        )}

        {/* Appointments Grid */}
        {!isLoading && !error && appointments.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {appointments.map((appointment, index) => {
              const studentEmail = appointment.student_mail || appointment.email;
              const studentName = appointment.student_name || appointment.name || "Student";
              const studentMail = appointment.student_mail || appointment.email || "N/A";
              const phoneNumber = appointment.student_phone || appointment.phone || appointment.phone_number || "N/A";
              const appointmentTime = appointment.time || appointment.appointment_time || appointment.date_time;

              return (
                <div
                  key={`${studentEmail}-${index}`}
                  onClick={() => handleAppointmentClick(studentEmail)}
                  style={{
                    background: "#fff",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ marginBottom: "1rem", color: "#ff6b35", fontWeight: "600", fontSize: "1.1rem" }}>
                    🕐 {formatTime(appointmentTime)}
                  </div>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "#1f2937", fontSize: "1.25rem" }}>👤 {studentName}</h3>
                  <p style={{ margin: "0.25rem 0", color: "#6b7280", fontSize: "0.875rem" }}>✉️ {studentMail}</p>
                  <p style={{ margin: "0.25rem 0", color: "#6b7280", fontSize: "0.875rem" }}>📞 {phoneNumber}</p>
                  <div style={{ marginTop: "1rem", color: "#ff6b35", fontSize: "0.875rem", fontWeight: "600" }}>View Profile →</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
