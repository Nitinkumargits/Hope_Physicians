import axios from "axios";
import { staffApi } from "../api/staff/staffApi";

import { API_BASE_URL } from "../config/apiConfig";

const API_BASE = API_BASE_URL;

// Mock data for development
const MOCK_TASKS = [
  {
    id: 1,
    title: "Assist with KYC uploads",
    count: 3,
    priority: "high",
    status: "pending",
    description: "Help patients upload and verify their KYC documents",
    dueDate: "2024-01-20",
    category: "KYC",
  },
  {
    id: 2,
    title: "Schedule appointments",
    count: 5,
    priority: "medium",
    status: "pending",
    description: "Schedule patient appointments for the week",
    dueDate: "2024-01-21",
    category: "Appointments",
  },
  {
    id: 3,
    title: "Update patient records",
    count: 2,
    priority: "low",
    status: "completed",
    description: "Update patient medical records in the system",
    dueDate: "2024-01-19",
    category: "Records",
  },
  {
    id: 4,
    title: "Process insurance forms",
    count: 8,
    priority: "high",
    status: "pending",
    description: "Process and verify insurance claim forms",
    dueDate: "2024-01-20",
    category: "Insurance",
  },
];

const MOCK_KYC_ASSISTANCE = [
  {
    id: 1,
    patient: "Robert Taylor",
    patientId: 201,
    patientEmail: "robert.t@example.com",
    patientPhone: "(252) 555-0201",
    submitted: "2 days ago",
    submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    documents: 3,
    status: "pending",
    documentsList: ["ID Card", "Proof of Address", "Insurance Card"],
  },
  {
    id: 2,
    patient: "Emily Davis",
    patientId: 202,
    patientEmail: "emily.d@example.com",
    patientPhone: "(252) 555-0202",
    submitted: "1 day ago",
    submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    documents: 2,
    status: "pending",
    documentsList: ["ID Card", "Proof of Address"],
  },
  {
    id: 3,
    patient: "David Wilson",
    patientId: 203,
    patientEmail: "david.w@example.com",
    patientPhone: "(252) 555-0203",
    submitted: "3 days ago",
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    documents: 4,
    status: "in-progress",
    documentsList: [
      "ID Card",
      "Proof of Address",
      "Insurance Card",
      "Medical History",
    ],
  },
];

export const getStaffDashboardStats = async () => {
  try {
    const response = await staffApi.getStats();
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to fetch staff stats:", error);
    throw error;
  }
};

export const getTasks = async (params = {}) => {
  try {
    const response = await staffApi.getTasks(params);
    return {
      data: response.data?.data || [],
      total: response.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    // Return empty array on error
    return {
      data: [],
      total: 0,
    };
  }
};

export const startTask = async (taskId) => {
  try {
    const response = await staffApi.startTask(taskId);
    return response.data;
  } catch (error) {
    console.error("Failed to start task:", error);
    throw error;
  }
};

export const completeTask = async (taskId) => {
  try {
    const response = await staffApi.completeTask(taskId);
    return response.data;
  } catch (error) {
    console.error("Failed to complete task:", error);
    throw error;
  }
};

export const getKYCAssistance = async (params = {}) => {
  try {
    const response = await staffApi.getKYCAssistance(params);
    return {
      data: response.data?.data || [],
      total: response.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Failed to fetch KYC assistance:", error);
    // Return empty array on error
    return {
      data: [],
      total: 0,
    };
  }
};

export const assistKYC = async (kycId, notes = "") => {
  try {
    const response = await staffApi.assistKYC(kycId, { notes });
    return response.data;
  } catch (error) {
    console.error("Failed to assist KYC:", error);
    throw error;
  }
};

export const checkIn = async (data = {}) => {
  try {
    const response = await staffApi.checkIn(data);
    return response.data;
  } catch (error) {
    console.error("Failed to check in:", error);
    throw error;
  }
};

export const checkOut = async (data = {}) => {
  try {
    const response = await staffApi.checkOut(data);
    return response.data;
  } catch (error) {
    console.error("Failed to check out:", error);
    throw error;
  }
};

export const getAttendanceStatus = async () => {
  try {
    const response = await staffApi.getAttendanceStatus();
    return response.data;
  } catch (error) {
    console.error("Failed to fetch attendance status:", error);
    // Fallback to localStorage
    const todayCheckIn = localStorage.getItem("checkInTime");
    return {
      checkedIn: !!todayCheckIn,
      checkInTime: todayCheckIn || null,
      checkOutTime: localStorage.getItem("checkOutTime") || null,
    };
  }
};

export const getAttendanceHistory = async (params = {}) => {
  try {
    const response = await staffApi.getAttendanceHistory(params);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch attendance history:", error);
    throw error;
  }
};
