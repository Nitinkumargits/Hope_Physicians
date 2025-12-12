import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

export const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/admin/stats`, {
      timeout: 3000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmployees = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/admin/employees`, {
      params,
      timeout: 3000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatients = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/admin/patients`, {
      params,
      timeout: 3000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctors = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/admin/doctors`, {
      params,
      timeout: 3000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/admin/appointments`, {
      params,
      timeout: 3000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reviewKYC = async (kycId, action, remark = "") => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE}/admin/kyc/${kycId}/review`,
      { action, remark },
      {
        timeout: 3000,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAttendance = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/admin/attendance`, {
      params,
      timeout: 3000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
