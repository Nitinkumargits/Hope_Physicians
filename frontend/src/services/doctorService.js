import axios from "axios";

import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

/**
 * Get today's appointments for the logged-in doctor
 */
export const getTodayAppointments = async (doctorId) => {
  try {
    const response = await axios.get(`${API_BASE}/doctor/appointments/today`, {
      params: { doctorId },
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is not available
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
            patientId: "patient-1",
            patient: {
              id: "patient-1",
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              phone: "(252) 555-0101",
              dateOfBirth: "1985-03-15",
              address: "123 Main St, Kinston, NC 28501",
            },
            time: "10:00 AM",
            date: new Date().toISOString().split("T")[0],
            status: "scheduled",
            type: "Follow-up",
            notes: "Regular checkup",
          },
          {
            id: 2,
            patientId: "patient-2",
            patient: {
              id: "patient-2",
              firstName: "Jane",
              lastName: "Smith",
              email: "jane.smith@example.com",
              phone: "(252) 555-0102",
              dateOfBirth: "1990-07-22",
              address: "456 Oak Ave, Kinston, NC 28501",
            },
            time: "11:00 AM",
            date: new Date().toISOString().split("T")[0],
            status: "in-progress",
            type: "Consultation",
            notes: "New patient",
          },
          {
            id: 3,
            patientId: "patient-3",
            patient: {
              id: "patient-3",
              firstName: "Mike",
              lastName: "Johnson",
              email: "mike.johnson@example.com",
              phone: "(252) 555-0103",
              dateOfBirth: "1978-11-08",
              address: "789 Pine Rd, Kinston, NC 28501",
            },
            time: "02:00 PM",
            date: new Date().toISOString().split("T")[0],
            status: "scheduled",
            type: "Follow-up",
            notes: "Post-surgery review",
          },
          {
            id: 4,
            patientId: "patient-4",
            patient: {
              id: "patient-4",
              firstName: "Sarah",
              lastName: "Brown",
              email: "sarah.brown@example.com",
              phone: "(252) 555-0104",
              dateOfBirth: "1992-05-30",
              address: "321 Elm St, Kinston, NC 28501",
            },
            time: "03:30 PM",
            date: new Date().toISOString().split("T")[0],
            status: "scheduled",
            type: "Consultation",
            notes: "Annual physical",
          },
        ],
      };
    }
    throw error;
  }
};

/**
 * Get doctor dashboard stats
 */
export const getDoctorStats = async (doctorId) => {
  try {
    const response = await axios.get(`${API_BASE}/doctor/stats`, {
      params: { doctorId },
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data
    if (
      error.code === "ECONNREFUSED" ||
      error.response?.status === 404 ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using mock stats data");
      return {
        todayAppointments: 4,
        upcoming: 12,
        totalPatients: 247,
        completedToday: 5,
      };
    }
    throw error;
  }
};

/**
 * Accept an appointment
 */
export const acceptAppointment = async (appointmentId) => {
  try {
    console.log(`📤 Accepting appointment ${appointmentId} at: ${API_BASE}/doctor/appointments/${appointmentId}/accept`);
    
    const response = await axios.patch(
      `${API_BASE}/doctor/appointments/${appointmentId}/accept`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout (increased for database operations and email sending)
      }
    );
    
    console.log(`✅ Appointment ${appointmentId} accepted successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to accept appointment:", {
      appointmentId,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      url: `${API_BASE}/doctor/appointments/${appointmentId}/accept`,
      response: error.response?.data,
    });

    // Handle 502 Bad Gateway - Backend not reachable
    if (error.response?.status === 502) {
      const enhancedError = new Error(
        "The server is temporarily unavailable. Please try again in a few moments."
      );
      enhancedError.status = 502;
      enhancedError.isGatewayError = true;
      enhancedError.appointmentId = appointmentId;
      throw enhancedError;
    }

    // Handle 404 - Appointment not found
    if (error.response?.status === 404) {
      const enhancedError = new Error(
        "Appointment not found. It may have been deleted or already processed."
      );
      enhancedError.status = 404;
      enhancedError.isNotFoundError = true;
      enhancedError.appointmentId = appointmentId;
      throw enhancedError;
    }

    // Handle 400 - Bad request
    if (error.response?.status === 400) {
      const enhancedError = new Error(
        error.response?.data?.error || "Invalid request. Please check the appointment details."
      );
      enhancedError.status = 400;
      enhancedError.isBadRequestError = true;
      enhancedError.appointmentId = appointmentId;
      throw enhancedError;
    }

    // Handle 500 - Server error
    if (error.response?.status === 500) {
      const enhancedError = new Error(
        "Server error occurred while accepting appointment. Please try again or contact support."
      );
      enhancedError.status = 500;
      enhancedError.isServerError = true;
      enhancedError.appointmentId = appointmentId;
      throw enhancedError;
    }

    // Handle connection refused or network errors
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      error.message.includes("Network Error") ||
      error.message.includes("timeout")
    ) {
      const enhancedError = new Error(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
      enhancedError.code = error.code;
      enhancedError.isConnectionError = true;
      enhancedError.appointmentId = appointmentId;
      throw enhancedError;
    }

    // Re-throw other errors with enhanced information
    const enhancedError = new Error(
      error.response?.data?.error || error.message || "Failed to accept appointment. Please try again."
    );
    enhancedError.status = error.response?.status;
    enhancedError.code = error.code;
    enhancedError.appointmentId = appointmentId;
    throw enhancedError;
  }
};

/**
 * Get all appointments for a doctor
 */
export const getAllAppointments = async (doctorId, filters = {}) => {
  try {
    console.log(
      `📡 Fetching appointments for doctor ${doctorId} with filters:`,
      filters
    );
    const response = await axios.get(`${API_BASE}/doctor/appointments`, {
      params: { doctorId, ...filters },
      timeout: 5000, // Increased timeout
    });
    console.log("✅ API Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_BASE}/doctor/appointments`,
      params: { doctorId, ...filters },
    });

    // Fallback to mock data only for network errors
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      console.warn("⚠️ API not available, using empty array");
      return {
        data: [],
      };
    }

    // For 404 or other errors, throw to show error message
    if (error.response?.status === 404) {
      console.warn("⚠️ Endpoint not found (404), using empty array");
      return {
        data: [],
      };
    }

    throw error;
  }
};

/**
 * Get appointments by date range for calendar view
 */
export const getAppointmentsByDateRange = async (
  doctorId,
  startDate,
  endDate,
  filters = {}
) => {
  try {
    const response = await axios.get(`${API_BASE}/doctor/appointments`, {
      params: {
        doctorId,
        startDate,
        endDate,
        ...filters,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments by date range:", error);
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      return { data: [] };
    }
    throw error;
  }
};

/**
 * Get patient queue for a doctor
 */
export const getPatientQueue = async (doctorId) => {
  try {
    const response = await axios.get(`${API_BASE}/doctor/${doctorId}/queue`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient queue:", error);
    throw error;
  }
};

/**
 * Update patient queue status
 */
export const updateQueueStatus = async (appointmentId, statusData) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/doctor/queue/${appointmentId}`,
      statusData,
      {
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating queue status:", error);
    throw error;
  }
};

/**
 * Get doctor dashboard analytics
 */
export const getDashboardAnalytics = async (doctorId, dateRange = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE}/doctor/${doctorId}/analytics`,
      {
        params: dateRange,
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    throw error;
  }
};

/**
 * Get all patients for a doctor
 */
export const getDoctorPatients = async (doctorId, filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/patients`, {
      params: { doctorId, ...filters },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor patients:", error);
    // Return empty array on network errors
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      console.warn("API not available, using empty array");
      return { data: [] };
    }
    throw error;
  }
};
