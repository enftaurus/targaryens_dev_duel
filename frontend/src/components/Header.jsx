import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  // 🧭 Nav Items
  const navItems = user
    ? [
        { name: "Home", path: "/dashboard" },
        { name: "Self-Check", path: "/selfcheck" },
        { name: "Videos", path: "/videos" },
        { name: "Stories", path: "/stories" },
        { name: "Appointments", path: "/appointments" },
        { name: "FAQ", path: "/FAQ" },
      ]
    : []; // ❌ No nav items on landing page when logged out

  // ✅ Logout with toast
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully ✅");
      navigate("http://localhost:5173/");
    } catch (err) {
      toast.error("Logout failed ❌");
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="header">
      <div className="container bar">
        {/* --- Brand / Logo --- */}
        <div className="brand" onClick={() => navigate("/")}>
          <div className="logo">🧠</div>
          <div>
            <h3><b>Student Sanctuary</b><br />Wellness for students<br /></h3>
          </div>
        </div>

        {/* --- Desktop Nav --- */}
        <nav className="nav hidden-mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* --- Auth Buttons --- */}
        <div className="cta hidden-mobile">
          {user ? (
            <>
              <NavLink to="/profile" className="btn ghost">
                {user.displayName || "Profile"}
              </NavLink>
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            isLandingPage && (
              <>
                <NavLink
                  to="/counsellor/login"
                  className="btn ghost"
                  style={{ marginRight: "0.5rem" }}
                >
                  Counsellor Login
                </NavLink>
                <NavLink to="/login" className="btn ghost">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn primary">
                  Sign Up
                </NavLink>
              </>
            )
          )}
        </div>

        {/* --- Mobile Toggle --- */}
        <button
          className="btn ghost show-mobile"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* --- Mobile Menu --- */}
      {open && (
        <div className="mobile-menu show-mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {user ? (
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            isLandingPage && (
              <>
                <NavLink
                  to="/counsellor/login"
                  className="btn ghost"
                  onClick={() => setOpen(false)}
                >
                  Counsellor Login
                </NavLink>
                <NavLink
                  to="/login"
                  className="btn ghost"
                  onClick={() => setOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn primary"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )
          )}
        </div>
      )}
    </header>
  );
}
