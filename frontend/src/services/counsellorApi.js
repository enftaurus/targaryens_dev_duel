import axios from "axios";
import Cookies from "js-cookie";

/**
 * ==============================
 * Axios instance
 * ==============================
 */
const counsellorApi = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ==============================
 * Request Interceptor
 * ==============================
 * Ensures cookies are always sent
 */
counsellorApi.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ==============================
 * Response Interceptor
 * ==============================
 * Handles auth expiry globally
 */
counsellorApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogout = error.config?.url?.includes("/counsellor/logout");

    if (error.response?.status === 401 && !isLogout) {
      Cookies.remove("counsellor_mail");

      if (window.location.pathname !== "/counsellor/login") {
        window.location.href = "/counsellor/login";
      }
    }

    return Promise.reject(error);
  }
);

/**
 * ==============================
 * Cookie Helper
 * ==============================
 */
export const getCounsellorEmail = () => {
  return Cookies.get("counsellor_mail") || null;
};

/**
 * ==============================
 * AUTH APIs
 * ==============================
 */

/**
 * POST /counsellor/login
 * body: { mail, password }
 */
export const counsellorLogin = (email, password) => {
  return counsellorApi.post("/counsellor/login", {
    mail: email,
    password,
  });
};

/**
 * POST /counsellor/logout
 */
export const counsellorLogout = () => {
  return counsellorApi.post("/counsellor/logout");
};

/**
 * GET /counsellor_profile
 * (auth check / profile)
 */
export const getCounsellorProfile = () => {
  return counsellorApi.get("/counsellor_profile");
};

/**
 * ==============================
 * DASHBOARD APIs
 * ==============================
 * ⚠️ Backend typo is REAL → "dasboard"
 */

/**
 * GET /counsellor/dasboard
 */
export const getCounsellorDashboard = () => {
  return counsellorApi.get("/counsellor/dasboard");
};

/**
 * GET /counsellor/dasboard/{student_mail}
 */
export const getStudentProfile = (studentMail) => {
  return counsellorApi.get(
    `/counsellor/dasboard/${encodeURIComponent(studentMail)}`
  );
};

/**
 * ==============================
 * NOTES APIs
 * ==============================
 */

/**
 * POST /counsellor_notes/get_notes
 * body: { student_mail, counsellor_mail }
 */
export const getNotes = (studentMail, counsellorMail) => {
  return counsellorApi.post("/counsellor_notes/get_notes", {
    student_mail: studentMail,
    counsellor_mail: counsellorMail,
  });
};

/**
 * POST /counsellor_notes/add_notes
 * body: { student_mail, counsellor_mail, note }
 */
export const addNote = (studentMail, counsellorMail, note) => {
  return counsellorApi.post("/counsellor_notes/add_notes", {
    student_mail: studentMail,
    counsellor_mail: counsellorMail,
    note,
  });
};

export default counsellorApi;
