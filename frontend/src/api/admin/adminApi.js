/**
 * Admin API Client
 * API calls for admin dashboard and management
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Dashboard Statistics
  getStats: () => api.get('/admin/staff/stats'),
  
  // Appointments
  getAppointments: (params) => api.get('/appointments', { params }),
  getTodayAppointments: () => {
    const today = new Date().toISOString().split('T')[0];
    return api.get('/appointments', { params: { date: today } });
  },
  
  // Patients
  getPatients: (params) => api.get('/patients', { params }),
  getPatientById: (id) => api.get(`/patients/${id}`),
  
  // Doctors
  getDoctors: () => api.get('/admin/doctors'),
  
  // Staff & Employees
  getStaff: (params) => api.get('/admin/staff/staff', { params }),
  getEmployees: (params) => api.get('/admin/staff/employees', { params }),
  
  // KYC Documents
  getKYCDocuments: (params) => api.get('/admin/kyc', { params }),
  reviewKYC: (id, data) => api.put(`/admin/kyc/${id}/review`, data),
  
  // Attendance
  getAttendance: (params) => api.get('/admin/staff/attendance', { params }),
};

export default adminApi;

