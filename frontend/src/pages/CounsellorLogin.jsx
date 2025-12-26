// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import Cookies from "js-cookie";
// import { counsellorLogin, getCounsellorProfile } from "../services/counsellorApi";
// import "../styles/counsellor.css";

// export default function CounsellorLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Check if already logged in on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         await getCounsellorProfile();
//         // If successful, redirect to dashboard
//         navigate("/counsellor/dashboard", { replace: true });
//       } catch (error) {
//         // If 401, user is not authenticated, stay on login page
//         // This is expected for users who aren't logged in
//       }
//     };
//     checkAuth();
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await counsellorLogin(email, password);
      
//       // Store counsellor email in JavaScript-accessible cookie (use different name to avoid httponly conflict)
//       Cookies.set("counsellor_mail", email, { expires: 0.5 });
      
//       toast.success("Login successful");
//       // Navigate immediately
//       navigate("/counsellor/dashboard", { replace: true });
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(
//         error.response?.data?.detail || 
//         error.response?.data?.message || 
//         "Login failed. Please check your credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="counsellor-login-container">
//       <div className="counsellor-login-card">
//         <div className="counsellor-login-header">
//           <h1 className="counsellor-login-title">Counsellor Portal</h1>
//           <p className="counsellor-login-subtitle">Sign in to access your dashboard</p>
//         </div>

//         <form onSubmit={handleSubmit} className="counsellor-login-form">
//           <div className="counsellor-form-group">
//             <label htmlFor="email" className="counsellor-form-label">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="counsellor-form-input"
//               placeholder="counsellor@example.com"
//               autoComplete="email"
//             />
//           </div>

//           <div className="counsellor-form-group">
//             <label htmlFor="password" className="counsellor-form-label">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="counsellor-form-input"
//               placeholder="Enter your password"
//               autoComplete="current-password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="counsellor-btn counsellor-btn-primary counsellor-btn-large"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  counsellorLogin,
  getCounsellorProfile,
} from "../services/counsellorApi";
import "../style.css";

const CounsellorLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ mail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCounsellorProfile();
        navigate("/counsellor/dashboard", { replace: true });
      } catch {
        // not logged in
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await counsellorLogin(form.mail, form.password);

      Cookies.set("counsellor_mail", form.mail, { expires: 0.5 });

      toast.success("✅ Login successful");
      navigate("/counsellor/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="login-wrapper">
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Counsellor Portal</h2>
            <p className="subtext">
              Sign in to access your professional dashboard 🌱
            </p>

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

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CounsellorLogin;
