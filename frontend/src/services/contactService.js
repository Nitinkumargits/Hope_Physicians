// services/contactService.js
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

/**
 * Contact Service - API methods for contact form and message management
 */

/**
 * Submit contact form (public endpoint)
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE}/contact`, formData, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || "Failed to submit contact form",
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
};

/**
 * Get all contact messages with filters (admin/doctor only)
 */
export const getContactMessages = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.get(
      `${API_BASE}/contact/messages?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch contact messages"
      );
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Get single contact message by ID (admin/doctor only)
 */
export const getContactMessage = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/contact/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contact message:", error);
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch contact message"
      );
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Update message status (admin/doctor only)
 */
export const updateMessageStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE}/contact/messages/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating message status:", error);
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to update message status"
      );
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Delete contact message (admin only)
 */
export const deleteContactMessage = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE}/contact/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting contact message:", error);
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to delete contact message"
      );
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

export default {
  submitContactForm,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  deleteContactMessage,
};

