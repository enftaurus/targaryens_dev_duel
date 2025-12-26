import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

/* ===== Student Pages ===== */
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Stories from "./pages/Stories";
import Videos from "./pages/Videos";
import SelfCheck from "./pages/SelfCheck";
import Appointments from "./pages/Appointments";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

/* ===== Counsellor Pages ===== */
import CounsellorLogin from "./pages/CounsellorLogin";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import StudentProfile from "./pages/StudentProfile";

/* ===== Auth ===== */
import { ProtectedRoute } from "./hooks/useAuth";
import { CounsellorProtectedRoute } from "./components/CounsellorProtectedRoute";

export default function App() {
  const location = useLocation();
  const isCounsellorRoute = location.pathname.startsWith("/counsellor");

  return (
    <div className="app">
      {/* ✅ Toast Container (ONLY ONCE in whole app) */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      {!isCounsellorRoute && <Header />}

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ===== Public Routes ===== */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ===== Student Protected Routes ===== */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/selfcheck"
              element={
                <ProtectedRoute>
                  <SelfCheck />
                </ProtectedRoute>
              }
            />
            <Route
              path="/videos"
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stories"
              element={
                <ProtectedRoute>
                  <Stories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/FAQ"
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              }
            />
            <Route path="/faq" element={<Navigate to="/FAQ" replace />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ===== Counsellor Routes ===== */}
            <Route path="/counsellor/login" element={<CounsellorLogin />} />
            <Route
              path="/counsellor/dashboard"
              element={
                <CounsellorProtectedRoute>
                  <CounsellorDashboard />
                </CounsellorProtectedRoute>
              }
            />
            <Route
              path="/counsellor/dashboard/:student_mail"
              element={
                <CounsellorProtectedRoute>
                  <StudentProfile />
                </CounsellorProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isCounsellorRoute && <Footer />}
    </div>
  );
}
