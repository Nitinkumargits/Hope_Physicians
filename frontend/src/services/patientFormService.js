// services/patientFormService.js
import axios from "axios";

// Get API URL from runtime config (window.APP_CONFIG) or environment variable
// This allows changing API URL without rebuilding
const getApiUrl = () => {
  // Priority 1: Runtime config from window (set in index.html or config.js)
  if (
    typeof window !== "undefined" &&
    window.APP_CONFIG &&
    window.APP_CONFIG.API_URL
  ) {
    return window.APP_CONFIG.API_URL;
  }
  // Priority 2: Environment variable (set at build time)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Priority 3: Auto-detect based on current host
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // If running on production server, use production API
    if (host === "52.66.236.157" || host.includes("52.66.236.157")) {
      return `http://${host}:5000/api`;
    }
  }
  // Fallback: localhost for development
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiUrl();

// Log API URL for debugging (remove in production)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔗 API Base URL:", API_BASE_URL);
}

const patientFormService = {
  // Submit Patient Information form
  submitPatientInfoForm: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/patient-forms/patient-info`,
        formData,
        {
          timeout: 30000, // Increased to 30 seconds for production
          headers: {
            "Content-Type": "application/json",
          },
          // Add retry logic for production
          validateStatus: function (status) {
            return status < 500; // Don't throw on 4xx errors
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error submitting Patient Information form:", error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || "Failed to submit form",
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Network error. Please check your connection.",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },

  // Submit Privacy Acknowledgement form
  submitPrivacyForm: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/patient-forms/privacy-ack`,
        formData,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error submitting Privacy Acknowledgement form:", error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || "Failed to submit form",
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Network error. Please check your connection.",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },

  // Submit Parental Consent form
  submitParentalConsentForm: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/patient-forms/parental-consent`,
        formData,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error submitting Parental Consent form:", error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || "Failed to submit form",
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Network error. Please check your connection.",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },

  // Submit Release of Information form
  submitReleaseInfoForm: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/patient-forms/release-info`,
        formData,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error submitting Release of Information form:", error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || "Failed to submit form",
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Network error. Please check your connection.",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },
};

export default patientFormService;
