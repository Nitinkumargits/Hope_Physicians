// services/patientFormService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const patientFormService = {
  // Submit Patient Information form
  submitPatientInfoForm: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/patient-forms/patient-info`,
        formData,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting Patient Information form:', error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Failed to submit form',
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
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
            'Content-Type': 'application/json',
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting Privacy Acknowledgement form:', error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Failed to submit form',
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
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
            'Content-Type': 'application/json',
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting Parental Consent form:', error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Failed to submit form',
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
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
            'Content-Type': 'application/json',
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting Release of Information form:', error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Failed to submit form',
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
};

export default patientFormService;

