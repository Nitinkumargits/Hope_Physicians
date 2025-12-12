/**
 * Reception API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/staff/reception`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Patient APIs
export const patientApi = {
  register: (data) => api.post("/patients", data),
  getAll: (params) => api.get("/patients", { params }),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
};

// Appointment APIs
export const appointmentApi = {
  create: (data) => api.post("/appointments", data),
  getAll: (params) => api.get("/appointments", { params }),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id, reason) =>
    api.delete(`/appointments/${id}`, { data: { reason } }),
};

// Billing APIs
export const billingApi = {
  create: (data) => api.post("/billing", data),
  getAll: (params) => api.get("/billing", { params }),
  getStats: (params) => api.get("/billing/stats", { params }),
  updatePayment: (id, data) => api.put(`/billing/${id}/payment`, data),
  generatePDF: (id) => api.get(`/billing/${id}/pdf`, { responseType: "blob" }),
};

export default {
  patientApi,
  appointmentApi,
  billingApi,
};
