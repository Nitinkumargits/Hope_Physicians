import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

export const submitAppointment = async (data) => {
  try {
    console.log(`📤 Submitting appointment to: ${API_BASE}/appointments`);
    const response = await axios.post(`${API_BASE}/appointments`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout (increased for slow connections)
    });
    console.log(`✅ Appointment submitted successfully:`, response.data);
    return response;
  } catch (error) {
    console.error("❌ Appointment submission error:", {
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      url: `${API_BASE}/appointments`,
    });

    // Handle 502 Bad Gateway - Backend not reachable
    if (error.response?.status === 502) {
      const enhancedError = new Error(
        "The server is temporarily unavailable. Please try again in a few moments or call us at 252-522-3663."
      );
      enhancedError.status = 502;
      enhancedError.isGatewayError = true;
      throw enhancedError;
    }

    // Handle connection refused or network errors
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error") ||
      error.message.includes("timeout")
    ) {
      const enhancedError = new Error(
        "Unable to connect to the server. Please check your internet connection and try again, or call us at 252-522-3663."
      );
      enhancedError.code = error.code;
      enhancedError.isConnectionError = true;
      throw enhancedError;
    }

    // Re-throw other errors with original message
    throw error;
  }
};
