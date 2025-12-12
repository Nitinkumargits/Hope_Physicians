/**
 * Staff API Client
 * API calls for staff dashboard and operations
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/portal/login";
    }
    return Promise.reject(error);
  }
);

export const staffApi = {
  // Dashboard Statistics
  getStats: () => api.get("/staff/stats"),

  // Tasks
  getTasks: (params) => api.get("/staff/tasks", { params }),
  startTask: (id) => api.post(`/staff/tasks/${id}/start`),
  completeTask: (id) => api.post(`/staff/tasks/${id}/complete`),

  // Attendance
  checkIn: (data) => api.post("/staff/attendance/check-in", data),
  checkOut: (data) => api.post("/staff/attendance/check-out", data),
  getAttendanceStatus: () => api.get("/staff/attendance/status"),
  getAttendanceHistory: (params) =>
    api.get("/staff/attendance/history", { params }),

  // KYC Assistance
  getKYCAssistance: (params) => api.get("/staff/kyc-assistance", { params }),
  assistKYC: (id, data) => api.post(`/staff/kyc-assistance/${id}/assist`, data),
};

export default staffApi;
