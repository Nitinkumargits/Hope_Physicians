/**
 * Patient Prescription API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: `${API_URL}/patient/prescriptions`,
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

export const prescriptionApi = {
  getAll: (params) => api.get("/", { params }),
  getById: (id) => api.get(`/${id}`),
};

export default { prescriptionApi };
