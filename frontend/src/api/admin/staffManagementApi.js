/**
 * Admin Staff Management API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: `${API_URL}/admin/staff`,
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

// Staff APIs
export const staffApi = {
  getAll: (params) => api.get("/staff", { params }),
  getEmployees: (params) => api.get("/employees", { params }),
  add: (data) => api.post("/staff", data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Role Permission APIs
export const rolePermissionApi = {
  getAll: () => api.get("/roles"),
  update: (role, data) => api.put(`/roles/${role}/permissions`, data),
};

// Attendance APIs
export const attendanceApi = {
  getAll: (params) => api.get("/attendance", { params }),
};

// Inventory APIs
export const inventoryApi = {
  getAll: (params) => api.get("/inventory", { params }),
  add: (data) => api.post("/inventory", data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
};

// Statistics
export const adminStatsApi = {
  getStats: () => api.get("/stats"),
};

export default {
  staffApi,
  rolePermissionApi,
  attendanceApi,
  inventoryApi,
  adminStatsApi,
};
