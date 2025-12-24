import React, { useState } from "react";
import "../style.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [mail, setMail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ STEP 1: REQUEST OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:8000/forgot-password/request-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mail }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      setStep(2);
      setMessage(data.detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 2: VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:8000/forgot-password/update_password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mail,
            otp: Number(otp),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      setStep(3);
      setMessage(data.detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 3: RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8000/forgot-password/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mail,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      setMessage(data.detail + " 🎉");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <h2 className="fp-title">Forgot Password</h2>

        <p className="fp-subtitle">
          {step === 1 && "Enter your email to receive OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Set a new password"}
        </p>

        <div className="fp-steps">
          <span className={step >= 1 ? "active" : ""}>1</span>
          <span className={step >= 2 ? "active" : ""}>2</span>
          <span className={step >= 3 ? "active" : ""}>3</span>
        </div>

        {step === 1 && (
          <form className="fp-form" onSubmit={sendOtp}>
            <input
              type="email"
              placeholder="Registered email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
            <button disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="fp-form" onSubmit={verifyOtp}>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="fp-form" onSubmit={resetPassword}>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && <p className="fp-success">{message}</p>}
        {error && <p className="fp-error">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
