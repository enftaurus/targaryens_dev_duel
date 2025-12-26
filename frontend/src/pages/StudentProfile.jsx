import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getStudentProfile,
  getNotes,
  addNote,
  getCounsellorEmail,
  counsellorLogout,
} from "../services/counsellorApi";

export default function StudentProfile() {
  const { student_mail } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const counsellorEmail = getCounsellorEmail();

  useEffect(() => {
    if (!student_mail) {
      navigate("/counsellor/dashboard");
      return;
    }

    fetchStudentProfile();
    fetchNotes();
  }, [student_mail, navigate]);

  const fetchStudentProfile = async () => {
    if (!student_mail) return;

    try {
      const decodedMail = decodeURIComponent(student_mail);
      const response = await getStudentProfile(decodedMail);
      const studentDetails = response.data["student details"] || response.data;
      if (studentDetails) {
        setStudent(studentDetails);
      } else {
        setError("Student not found.");
      }
    } catch (err) {
      console.error("Error fetching student profile:", err);
      setError("Unable to load student profile.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchNotes = async () => {
    if (!student_mail || !counsellorEmail) {
      setIsLoadingNotes(false);
      return;
    }

    try {
      const decodedMail = decodeURIComponent(student_mail);
      console.log("Fetching notes for:", { student_mail: decodedMail, counsellor_mail: counsellorEmail });
      const response = await getNotes(decodedMail, counsellorEmail);
      console.log("Notes response:", response.data);
      
      // Backend returns {"notes": [...]} and notes have created_at field
      const fetchedNotes = response.data?.notes || [];
      
      // Notes are already sorted by backend (desc order), but ensure they're sorted correctly
      const sortedNotes = fetchedNotes.sort((a, b) => {
        const dateA = new Date(a.created_at || a.date_time || 0);
        const dateB = new Date(b.created_at || b.date_time || 0);
        return dateB - dateA; // Newest first
      });
      
      setNotes(sortedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      console.error("Error details:", err.response?.data);
      setNotes([]);
      if (err.response?.status !== 401) {
        toast.error("Failed to load notes");
      }
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!newNote.trim()) {
      toast.error("Please enter some notes before submitting");
      return;
    }
    if (!student_mail || !counsellorEmail) {
      console.log(student_mail, counsellorEmail);
      toast.error("Missing required information");
      return;
    }

    setIsSubmitting(true);
    try {
      const decodedMail = decodeURIComponent(student_mail);
      console.log("Adding note:", { student_mail: decodedMail, counsellor_mail: counsellorEmail, note: newNote.trim() });
      const response = await addNote(decodedMail, counsellorEmail, newNote.trim());
      console.log("Add note response:", response.data);
      setNewNote("");
      toast.success("Notes added successfully");
      // Refresh notes list after adding
      await fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
      console.error("Error details:", err.response?.data);
      const errorMessage = err.response?.data?.detail || "Unable to save notes. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const formatDateTime = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoadingProfile) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: "center", padding: "3rem" }}>
          <p>Loading student profile...</p>
        </div>
      </section>
    );
  }

  if (error || !student) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 640, textAlign: "center" }}>
          <p style={{ color: "#991b1b" }}>⚠️ {error || "Student profile not found."}</p>
          <button onClick={() => navigate("/counsellor/dashboard")} className="btn">
            ← Back to Dashboard
          </button>
        </div>
      </section>
    );
  }

  const studentName = student.name || student.student_name || "Student";
  const studentEmail = student.email || student.mail || "N/A";
  const consentGiven = student.consent || student.consent_given || false;
  const mentalHealthSummary = student.mental_health_summary || student.summary || student.health_summary;

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
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button onClick={() => navigate("/counsellor/dashboard")} className="btn" style={{ background: "#ff6b35", color: "#fff", border: "none" }}>
              ← Back
            </button>
            <div>
              <h2 style={{ color: "#ff6b35", margin: 0, fontSize: "2rem" }}>👤 Student Profile</h2>
              <p style={{ color: "#6b7280", margin: "0.5rem 0 0 0" }}>{studentName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn" style={{ background: "#ff6b35", color: "#fff", border: "none" }}>
            🚪 Sign Out
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Left Column - Student Details */}
          <div>
            {/* Profile Info */}
            <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: "#ff6b35", marginBottom: "1rem", fontSize: "1.25rem" }}>Basic Information</h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div>
                  <strong style={{ color: "#6b7280" }}>Email:</strong>
                  <p style={{ margin: "0.25rem 0 0 0" }}>{studentEmail}</p>
                </div>
                {student.age && (
                  <div>
                    <strong style={{ color: "#6b7280" }}>Age:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{student.age} years</p>
                  </div>
                )}
                {student.gender && (
                  <div>
                    <strong style={{ color: "#6b7280" }}>Gender:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{student.gender}</p>
                  </div>
                )}
                {student.education && (
                  <div>
                    <strong style={{ color: "#6b7280" }}>Education:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{student.education}</p>
                  </div>
                )}
                {student.institution && (
                  <div>
                    <strong style={{ color: "#6b7280" }}>Institution:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{student.institution}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mental Health Data */}
            {(student.phq9 !== undefined || student.gad7 !== undefined || student.sleep !== undefined || student.is_stressed !== undefined) && (
              <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "#ff6b35", marginBottom: "1rem", fontSize: "1.25rem" }}>📊 Mental Health Assessment</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {student.is_stressed !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Stress Status:</strong>
                      <p style={{ margin: "0.25rem 0 0 0", color: student.is_stressed ? "#dc2626" : "#16a34a" }}>
                        {student.is_stressed ? "Stressed" : "Not Stressed"}
                      </p>
                    </div>
                  )}
                  {student.phq9 !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>PHQ-9 Score:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.phq9}</p>
                    </div>
                  )}
                  {student.gad7 !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>GAD-7 Score:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.gad7}</p>
                    </div>
                  )}
                  {student.sleep !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Sleep Hours:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.sleep} hrs</p>
                    </div>
                  )}
                  {student.sleepquality !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Sleep Quality:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.sleepquality}/10</p>
                    </div>
                  )}
                  {student.exercisefreq !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Exercise Frequency:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.exercisefreq}/10</p>
                    </div>
                  )}
                  {student.socialactivity !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Social Activity:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.socialactivity}/10</p>
                    </div>
                  )}
                  {student.screentime !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Screen Time:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.screentime} hrs</p>
                    </div>
                  )}
                  {student.academicstress !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Academic Stress:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.academicstress}/10</p>
                    </div>
                  )}
                  {student.dietquality !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Diet Quality:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.dietquality}/10</p>
                    </div>
                  )}
                  {student.selfefficiency !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Self Efficiency:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.selfefficiency}/10</p>
                    </div>
                  )}
                  {student.peerrelationship !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Peer Relationship:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.peerrelationship}/10</p>
                    </div>
                  )}
                  {student.familysupport !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Family Support:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.familysupport}/10</p>
                    </div>
                  )}
                  {student.financialstress !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Financial Stress:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.financialstress}/10</p>
                    </div>
                  )}
                  {student.onlinestress !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>Online Stress:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.onlinestress}/10</p>
                    </div>
                  )}
                  {student.gpa !== undefined && (
                    <div>
                      <strong style={{ color: "#6b7280" }}>GPA:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{student.gpa}/10</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mental Health Summary */}
            {mentalHealthSummary && (
              <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "#ff6b35", marginBottom: "1rem", fontSize: "1.25rem" }}>📄 Health Summary</h3>
                <p style={{ color: "#4b5563", lineHeight: "1.6" }}>{mentalHealthSummary}</p>
              </div>
            )}
          </div>

          {/* Right Column - Notes */}
          <div>
            {/* Add New Note */}
            <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: "#ff6b35", marginBottom: "1rem", fontSize: "1.25rem" }}>📄 Session Notes</h3>
              <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.875rem" }}>
                Document your observations and notes from this session.
              </p>
              <form onSubmit={handleSubmitNote}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter session observations and notes…"
                  disabled={isSubmitting}
                  rows="8"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                  }}
                />
                <button
                  type="submit"
                  disabled={!newNote.trim() || isSubmitting}
                  className="btn primary"
                  style={{ width: "100%", background: "#ff6b35", color: "#fff", border: "none" }}
                >
                  📤 {isSubmitting ? "Saving..." : "Save Notes"}
                </button>
              </form>
            </div>

            {/* Previous Notes */}
            <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: "#ff6b35", marginBottom: "1rem", fontSize: "1.25rem" }}>Previous Notes</h3>

              {isLoadingNotes && (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <p>Loading notes...</p>
                </div>
              )}

              {!isLoadingNotes && notes.length === 0 && (
                <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                  <p style={{ fontSize: "2rem", margin: 0 }}>📄</p>
                  <p>No previous notes recorded.</p>
                </div>
              )}

              {!isLoadingNotes && notes.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {notes.map((note, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#f9fafb",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <strong style={{ color: "#1f2937", fontSize: "0.875rem" }}>
                          {note.counsellor_name || note.counsellor_mail || counsellorEmail}
                        </strong>
                        <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                          🕐 {formatDateTime(note.created_at || note.date_time || note.timestamp)}
                        </span>
                      </div>
                      <p style={{ color: "#4b5563", margin: 0, fontSize: "0.875rem", lineHeight: "1.5" }}>
                        {note.notes || note.note || note.notes_text || note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
