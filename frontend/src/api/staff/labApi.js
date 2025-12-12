/**
 * Lab API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: `${API_URL}/staff/lab`,
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

// Lab Test APIs
export const labTestApi = {
  create: (data) => api.post("/tests", data),
  getAll: (params) => api.get("/tests", { params }),
  getById: (id) => api.get(`/tests/${id}`),
  getStats: (params) => api.get("/tests/stats", { params }),
  assign: (id, data) => api.put(`/tests/${id}/assign`, data),
  updateStatus: (id, data) => api.put(`/tests/${id}/status`, data),
  uploadReport: (id, formData) =>
    api.post(`/tests/${id}/report`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default { labTestApi };
