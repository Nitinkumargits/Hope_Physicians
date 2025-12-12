/**
 * Patient Payment API Client
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: `${API_URL}/patient/payments`,
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

export const paymentApi = {
  create: (data) => api.post("/create", data),
  verify: (data) => api.post("/verify", data),
};

export default { paymentApi };
