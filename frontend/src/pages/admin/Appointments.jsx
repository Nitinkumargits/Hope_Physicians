import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { FaCalendarAlt, FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
import * as adminService from '../../services/adminService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await adminService.getAppointments();
      setAppointments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || apt.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return variants[status] || 'default';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-gray-600 mt-1">View and manage all appointments</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">{apt.patient_name}</p>
                      <Badge variant={getStatusBadge(apt.status)}>{apt.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{apt.doctor_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{apt.date}</span>
                      <span>{apt.time}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

