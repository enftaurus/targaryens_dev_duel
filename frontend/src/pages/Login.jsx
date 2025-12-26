import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ mail: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { mail, password } = form;
    const res = await login(mail, password);

    setLoading(false);

    if (res.success) {
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="login-wrapper">
      <header className="register-header">
        🌿 Student Sanctuary — Login
      </header>

      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p className="subtext">Sign in to continue your journey 🌱</p>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="mail"
              value={form.mail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🔹 Forgot Password link */}
          <p className="forgot-text">
            <a href="/forgot-password" className="highlight-link">
              Forgot password?
            </a>
          </p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="switch-text">
            Don’t have an account?{" "}
            <a href="/register" className="highlight-link">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
