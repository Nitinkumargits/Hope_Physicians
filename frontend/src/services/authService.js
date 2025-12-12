import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

// Mock user data for development
const MOCK_USERS = {
  admin: {
    id: 1,
    email: "admin@hopephysicians.com",
    password: "admin123",
    role: "admin",
    name: "Admin User",
    is_active: true,
    can_access_system: true,
  },
  doctor: {
    id: 2,
    email: "doctor@hopephysicians.com",
    password: "doctor123",
    role: "doctor",
    name: "Dr. Okonkwo",
    is_active: true,
    can_access_system: true,
    specialization: "Family Medicine",
  },
  patient: {
    id: 3,
    email: "patient@example.com",
    password: "patient123",
    role: "patient",
    name: "John Doe",
    is_active: true,
    can_access_system: true,
  },
  staff: {
    id: 4,
    email: "staff@hopephysicians.com",
    password: "staff123",
    role: "staff",
    name: "Jane Smith",
    is_active: true,
    can_access_system: true,
  },
};

export const login = async (email, password, role = null) => {
  try {
    // Try real API first
    const response = await axios.post(
      `${API_BASE}/auth/login`,
      {
        email,
        password,
        role,
      },
      {
        timeout: 10000, // 10 second timeout for production
      }
    );
    return response.data;
  } catch (error) {
    // Fallback to mock for development (catch 404, network errors, timeouts)
    const isNetworkError =
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error") ||
      error.response?.status === 404 ||
      error.code === "ECONNABORTED";

    if (isNetworkError) {
      console.warn("API not available, using mock data for login");

      // Find user in mock data
      const user = Object.values(MOCK_USERS).find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        throw new Error(
          "Invalid email or password. Please check your credentials."
        );
      }

      // Check role if specified
      if (role && user.role !== role.toLowerCase()) {
        throw new Error(
          `Access denied. This account is for ${user.role} role, but you selected ${role}.`
        );
      }

      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        token,
        user: {
          ...user,
          password: undefined, // Remove password from response
        },
      };
    }

    // Handle other API errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Login failed. Please try again.");
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000, // 10 second timeout for production
    });
    return response.data;
  } catch (error) {
    // Fallback to mock (catch 404, network errors, timeouts)
    const isNetworkError =
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error") ||
      error.response?.status === 404 ||
      error.code === "ECONNABORTED";

    if (isNetworkError) {
      const token = localStorage.getItem("token");
      if (!token) return null;

      // Extract user ID from mock token
      const match = token.match(/mock_token_(\d+)_/);
      if (match) {
        const userId = parseInt(match[1]);
        const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
        if (user) {
          return { ...user, password: undefined };
        }
      }
      return null;
    }
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    // Mock response
    if (error.code === "ECONNREFUSED") {
      return { message: "Password reset link sent to your email" };
    }
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/reset-password`, {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return { message: "Password reset successfully" };
    }
    throw error;
  }
};
