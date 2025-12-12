// services/prescriptionService.js
import axios from "axios";

import { API_BASE_URL } from "../config/apiConfig";

const API_URL = API_BASE_URL;

const prescriptionService = {
  // Create prescription
  createPrescription: async (prescriptionData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/prescriptions`,
      prescriptionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // Get prescription by ID
  getPrescription: async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/prescriptions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get all prescriptions for a doctor
  getDoctorPrescriptions: async (doctorId, filters = {}) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(filters);
    const response = await axios.get(
      `${API_URL}/prescriptions/doctor/${doctorId}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Get all prescriptions for a patient
  getPatientPrescriptions: async (patientId, filters = {}) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(filters);
    const response = await axios.get(
      `${API_URL}/prescriptions/patient/${patientId}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Update prescription
  updatePrescription: async (id, prescriptionData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/prescriptions/${id}`,
      prescriptionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // Delete prescription
  deletePrescription: async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/prescriptions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Generate prescription PDF
  generatePDF: async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/prescriptions/${id}/generate-pdf`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default prescriptionService;
export * from "./prescriptionService";
