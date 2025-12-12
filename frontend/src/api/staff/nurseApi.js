/**
 * Nurse API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: `${API_URL}/staff/nurse`,
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

// Vitals APIs
export const vitalsApi = {
  record: (data) => api.post("/vitals", data),
  getByPatient: (patientId, params) =>
    api.get(`/vitals/patient/${patientId}`, { params }),
};

// Patient Monitoring APIs
export const patientMonitorApi = {
  getAdmitted: (params) => api.get("/patients/admitted", { params }),
};

// Medication APIs
export const medicationApi = {
  create: (data) => api.post("/medication", data),
  getAll: (params) => api.get("/medication", { params }),
  markAdministered: (id, data) => api.put(`/medication/${id}/administer`, data),
};

// Bed Allocation APIs
export const bedApi = {
  allocate: (data) => api.post("/beds/allocate", data),
  getAll: (params) => api.get("/beds", { params }),
  release: (id, data) => api.put(`/beds/${id}/release`, data),
};

// Emergency Alert APIs
export const emergencyApi = {
  trigger: (data) => api.post("/emergency", data),
  getAll: (params) => api.get("/emergency", { params }),
  acknowledge: (id) => api.put(`/emergency/${id}/acknowledge`),
};

export default {
  vitalsApi,
  patientMonitorApi,
  medicationApi,
  bedApi,
  emergencyApi,
};
