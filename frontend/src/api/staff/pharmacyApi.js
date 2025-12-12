/**
 * Pharmacy API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: `${API_URL}/staff/pharmacy`,
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

// Medicine APIs
export const medicineApi = {
  getAll: (params) => api.get("/medicines", { params }),
  create: (data) => api.post("/medicines", data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  getExpiring: (params) => api.get("/medicines/expiring", { params }),
};

// Prescription Order APIs
export const orderApi = {
  getAll: (params) => api.get("/orders", { params }),
  create: (data) => api.post("/orders", data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Statistics
export const pharmacyStatsApi = {
  getStats: () => api.get("/stats"),
};

export default {
  medicineApi,
  orderApi,
  pharmacyStatsApi,
};
