import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

/**
 * Get patient by ID
 */
export const getPatientById = async (patientId) => {
  try {
    console.log(`📡 Fetching patient ${patientId}...`);
    const response = await axios.get(`${API_BASE}/patients/${patientId}`, {
      timeout: 5000,
    });
    console.log("✅ Patient data received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching patient:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      console.warn("⚠️ API not available, returning null");
      return null;
    }

    throw error;
  }
};

/**
 * Get all patients
 */
export const getAllPatients = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/patients`, {
      params: filters,
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching patients:", error);

    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      console.warn("⚠️ API not available, returning empty array");
      return { data: [] };
    }

    throw error;
  }
};
