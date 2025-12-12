/**
 * Patient Appointment API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: `${API_URL}/patient/appointments`,
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

export const appointmentApi = {
  getAll: (params) => api.get("/", { params }),
  getById: (id) => api.get(`/${id}`),
  book: (data) => api.post("/", data),
  cancel: (id, reason) => api.delete(`/${id}`, { data: { reason } }),
  reschedule: (id, data) => api.put(`/${id}/reschedule`, data),
  getAvailableDoctors: (params) => api.get("/doctors/available", { params }),
  getDoctorAvailability: (doctorId, params) =>
    api.get(`/doctors/${doctorId}/availability`, { params }),
};

export default { appointmentApi };
