import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock data for development
const MOCK_TASKS = [
  { 
    id: 1, 
    title: 'Assist with KYC uploads', 
    count: 3, 
    priority: 'high', 
    status: 'pending',
    description: 'Help patients upload and verify their KYC documents',
    dueDate: '2024-01-20',
    category: 'KYC'
  },
  { 
    id: 2, 
    title: 'Schedule appointments', 
    count: 5, 
    priority: 'medium', 
    status: 'pending',
    description: 'Schedule patient appointments for the week',
    dueDate: '2024-01-21',
    category: 'Appointments'
  },
  { 
    id: 3, 
    title: 'Update patient records', 
    count: 2, 
    priority: 'low', 
    status: 'completed',
    description: 'Update patient medical records in the system',
    dueDate: '2024-01-19',
    category: 'Records'
  },
  { 
    id: 4, 
    title: 'Process insurance forms', 
    count: 8, 
    priority: 'high', 
    status: 'pending',
    description: 'Process and verify insurance claim forms',
    dueDate: '2024-01-20',
    category: 'Insurance'
  }
];

const MOCK_KYC_ASSISTANCE = [
  { 
    id: 1, 
    patient: 'Robert Taylor', 
    patientId: 201,
    patientEmail: 'robert.t@example.com',
    patientPhone: '(252) 555-0201',
    submitted: '2 days ago',
    submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documents: 3, 
    status: 'pending',
    documentsList: ['ID Card', 'Proof of Address', 'Insurance Card']
  },
  { 
    id: 2, 
    patient: 'Emily Davis', 
    patientId: 202,
    patientEmail: 'emily.d@example.com',
    patientPhone: '(252) 555-0202',
    submitted: '1 day ago',
    submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documents: 2, 
    status: 'pending',
    documentsList: ['ID Card', 'Proof of Address']
  },
  { 
    id: 3, 
    patient: 'David Wilson', 
    patientId: 203,
    patientEmail: 'david.w@example.com',
    patientPhone: '(252) 555-0203',
    submitted: '3 days ago',
    submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documents: 4, 
    status: 'in-progress',
    documentsList: ['ID Card', 'Proof of Address', 'Insurance Card', 'Medical History']
  }
];

export const getStaffDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/staff/stats`, { timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock staff stats');
      return {
        tasksCompleted: 12,
        tasksPending: 5,
        kycPending: 3
      };
    }
    throw error;
  }
};

export const getTasks = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/staff/tasks`, { params, timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock tasks data');
      return {
        data: MOCK_TASKS,
        total: MOCK_TASKS.length
      };
    }
    throw error;
  }
};

export const startTask = async (taskId) => {
  try {
    const response = await axios.post(`${API_BASE}/staff/tasks/${taskId}/start`, {}, { timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock task start response');
      return { success: true, message: 'Task started successfully' };
    }
    throw error;
  }
};

export const completeTask = async (taskId) => {
  try {
    const response = await axios.post(`${API_BASE}/staff/tasks/${taskId}/complete`, {}, { timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock task complete response');
      return { success: true, message: 'Task completed successfully' };
    }
    throw error;
  }
};

export const getKYCAssistance = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/staff/kyc-assistance`, { params, timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock KYC assistance data');
      return {
        data: MOCK_KYC_ASSISTANCE,
        total: MOCK_KYC_ASSISTANCE.length
      };
    }
    throw error;
  }
};

export const assistKYC = async (kycId, notes = '') => {
  try {
    const response = await axios.post(`${API_BASE}/staff/kyc-assistance/${kycId}/assist`, { notes }, { timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock KYC assist response');
      return { success: true, message: 'KYC assistance provided successfully' };
    }
    throw error;
  }
};

export const checkIn = async () => {
  try {
    const response = await axios.post(`${API_BASE}/staff/attendance/check-in`, {}, { timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock check-in response');
      return { 
        success: true, 
        message: 'Checked in successfully',
        checkInTime: new Date().toISOString()
      };
    }
    throw error;
  }
};

export const checkOut = async () => {
  try {
    const response = await axios.post(`${API_BASE}/staff/attendance/check-out`, {}, { timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock check-out response');
      return { 
        success: true, 
        message: 'Checked out successfully',
        checkOutTime: new Date().toISOString(),
        hoursWorked: 8.5
      };
    }
    throw error;
  }
};

export const getAttendanceStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE}/staff/attendance/status`, { timeout: 3000 });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn('API not available, using mock attendance status');
      const todayCheckIn = localStorage.getItem('checkInTime');
      return {
        checkedIn: !!todayCheckIn,
        checkInTime: todayCheckIn || null,
        checkOutTime: localStorage.getItem('checkOutTime') || null
      };
    }
    throw error;
  }
};

