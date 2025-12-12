import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaClock,
  FaUserMd,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 100,
        },
      });

      const appointmentsData = response.data?.data || [];

      // Format appointments for display
      const formattedAppointments = appointmentsData.map((apt) => ({
        id: apt.id,
        patient: `${apt.patient?.firstName || ""} ${
          apt.patient?.lastName || ""
        }`.trim(),
        doctor:
          `${apt.doctor?.firstName || ""} ${
            apt.doctor?.lastName || ""
          }`.trim() || "N/A",
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        type: apt.appointmentType || "Consultation",
        status: apt.status,
        phone: apt.patient?.phone || "N/A",
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || apt.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: "primary",
      "in-progress": "info",
      completed: "success",
      cancelled: "danger",
    };
    return variants[status] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">
              View and manage patient appointments
            </p>
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FaCalendarAlt className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {apt.patient}
                        </p>
                        <p className="text-sm text-gray-600">{apt.doctor}</p>
                      </div>
                      <Badge variant={getStatusBadge(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {formatDate(apt.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {apt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUserMd className="w-3 h-3" />
                        {apt.type}
                      </span>
                      {apt.phone && (
                        <span className="flex items-center gap-1">
                          <FaUser className="w-3 h-3" />
                          {apt.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
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
