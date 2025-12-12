import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

// Mock data for development
const MOCK_STATS = {
  totalPatients: 1247,
  totalDoctors: 24,
  totalStaff: 48,
  appointmentsToday: 32,
  pendingKYC: 8,
  activeAppointments: 18,
  completedToday: 14,
};

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/admin/stats`, {
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available or returns 404
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available or endpoint not found, using mock data");
      return MOCK_STATS;
    }
    throw error;
  }
};

export const getEmployees = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/employees`, {
      params,
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available or returns 404
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using mock employees data");
      return {
        data: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "staff",
            is_active: true,
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "hr",
            is_active: true,
          },
        ],
        total: 2,
      };
    }
    throw error;
  }
};

export const getPatients = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/patients`, {
      params,
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available or returns 404
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using mock patients data");
      return {
        data: [
          {
            id: 1,
            name: "Patient One",
            email: "patient1@example.com",
            kyc_status: "approved",
          },
          {
            id: 2,
            name: "Patient Two",
            email: "patient2@example.com",
            kyc_status: "pending",
          },
        ],
        total: 2,
      };
    }
    throw error;
  }
};

export const getDoctors = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/doctors`, {
      params,
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available or returns 404
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using mock doctors data");
      return {
        data: [
          {
            id: 1,
            name: "Dr. Okonkwo",
            email: "doctor@hopephysicians.com",
            specialization: "Family Medicine",
          },
        ],
        total: 1,
      };
    }
    throw error;
  }
};

export const getAppointments = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/appointments`, {
      params,
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available or returns 404
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using mock appointments data");
      return {
        data: [
          {
            id: 1,
            patient_name: "John Doe",
            doctor_name: "Dr. Okonkwo",
            date: "2024-01-15",
            time: "10:00 AM",
            status: "scheduled",
          },
        ],
        total: 1,
      };
    }
    throw error;
  }
};

export const reviewKYC = async (kycId, action, remark = "") => {
  try {
    const response = await axios.post(
      `${API_BASE}/admin/kyc/${kycId}/review`,
      { action, remark },
      { timeout: 3000 }
    );
    return response.data;
  } catch (error) {
    // Fallback to mock response if API is not available or returns 404
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using mock KYC review response");
      return { success: true, message: `KYC ${action}ed successfully` };
    }
    throw error;
  }
};

export const getAttendance = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/attendance`, {
      params,
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available or returns 404
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using mock attendance data");
      return {
        data: [
          {
            id: 1,
            employee_name: "John Doe",
            check_in: "2024-01-15 09:00:00",
            check_out: "2024-01-15 17:00:00",
            hours: 8,
          },
        ],
        total: 1,
      };
    }
    throw error;
  }
};
