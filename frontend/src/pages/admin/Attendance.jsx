import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import {
  FaClock,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import * as adminService from "../../services/adminService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchAttendance = useCallback(async () => {
    try {
      const data = await adminService.getAttendance({ date: dateFilter });
      setAttendance(data.data || []);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, fetchAttendance]);

  const filteredAttendance = attendance.filter((record) =>
    record.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attendance Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage employee attendance
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* Attendance List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading attendance...</p>
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="text-center py-12">
              <FaClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">
                        {record.employee_name}
                      </p>
                      {record.check_in && record.check_out ? (
                        <Badge variant="success">
                          <FaCheckCircle className="w-3 h-3 mr-1" />
                          Present
                        </Badge>
                      ) : (
                        <Badge variant="danger">
                          <FaTimesCircle className="w-3 h-3 mr-1" />
                          Absent
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {record.check_in && (
                        <span>
                          Check-in:{" "}
                          {new Date(record.check_in).toLocaleTimeString()}
                        </span>
                      )}
                      {record.check_out && (
                        <span>
                          Check-out:{" "}
                          {new Date(record.check_out).toLocaleTimeString()}
                        </span>
                      )}
                      {record.hours && (
                        <span className="font-semibold">
                          Hours: {record.hours}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
