import axios from "axios";

import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

/**
 * Notification Service - API methods for doctor notifications
 */

/**
 * Get notifications for a doctor
 * If doctorId is provided, uses that; otherwise uses logged-in doctor from token
 */
export const getDoctorNotifications = async (doctorId, filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(filters);

    // Use /doctor endpoint (without ID) to get notifications for logged-in doctor
    // The backend will extract doctorId from the JWT token
    const endpoint = doctorId
      ? `${API_BASE}/notifications/doctor/${doctorId}?${params}`
      : `${API_BASE}/notifications/doctor?${params}`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor notifications:", error);
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
    throw error;
  }
};

/**
 * Get unread notification count for a doctor
 */
export const getUnreadCount = async (doctorId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE}/notifications/doctor${
        doctorId ? `/${doctorId}` : ""
      }/unread/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${API_BASE}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a doctor
 */
export const markAllAsRead = async (doctorId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${API_BASE}/notifications/doctor${
        doctorId ? `/${doctorId}` : ""
      }/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${API_BASE}/notifications/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Archive notification
 */
export const archiveNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${API_BASE}/notifications/${notificationId}/archive`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error archiving notification:", error);
    throw error;
  }
};

/**
 * PATIENT NOTIFICATION METHODS
 */

/**
 * Get notifications for a patient
 * If patientId is provided, uses that; otherwise uses logged-in patient from token
 */
export const getPatientNotifications = async (patientId, filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(filters);

    const endpoint = patientId
      ? `${API_BASE}/notifications/patient/${patientId}?${params}`
      : `${API_BASE}/notifications/patient?${params}`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient notifications:", error);
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
    throw error;
  }
};

/**
 * Get unread notification count for a patient
 */
export const getPatientUnreadCount = async (patientId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE}/notifications/patient${
        patientId ? `/${patientId}` : ""
      }/unread/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching patient unread count:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a patient
 */
export const markAllPatientAsRead = async (patientId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${API_BASE}/notifications/patient${
        patientId ? `/${patientId}` : ""
      }/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all patient notifications as read:", error);
    throw error;
  }
};
