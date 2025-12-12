import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import { useAuth } from "../../contexts/AuthContext";
import * as doctorService from "../../services/doctorService";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaEye,
  FaSpinner,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaIdCard,
} from "react-icons/fa";

const DoctorPatients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchPatients = useCallback(async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await doctorService.getDoctorPatients(user.doctorId, {
        search: searchTerm || undefined,
        kycStatus: filter !== "all" ? filter : undefined,
      });

      setPatients(response.data || []);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.doctorId, searchTerm, filter]);

  useEffect(() => {
    if (user && user.doctorId) {
      fetchPatients();
    } else {
      setLoading(false);
      toast.error("Doctor ID not found. Please log in again.");
    }
  }, [user, fetchPatients]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (user?.doctorId) {
        fetchPatients();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filter, user?.doctorId, fetchPatients]);

  const filteredPatients = patients.filter((patient) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        patient.firstName?.toLowerCase().includes(searchLower) ||
        patient.lastName?.toLowerCase().includes(searchLower) ||
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phone?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filter !== "all") {
      return patient.kycStatus === filter;
    }

    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getKycBadgeVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
            <p className="text-gray-600 mt-1">
              View and manage your patient records
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {patients.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaUsers className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Approved
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {patients.filter((p) => p.kycStatus === "approved").length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <FaIdCard className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {patients.filter((p) => p.kycStatus === "pending").length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-100">
                <FaCalendarAlt className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Showing
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredPatients.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-violet-100">
                <FaFilter className="w-8 h-8 text-violet-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Patients List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                No patients found
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any patients yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const fullName =
                  `${patient.firstName || ""} ${
                    patient.lastName || ""
                  }`.trim() || "Unknown Patient";
                const lastAppointment = patient.appointments?.[0];

                return (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FaUser className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Patient ID: {patient.id.substring(0, 8)}...
                          </p>
                        </div>
                        <Badge variant={getKycBadgeVariant(patient.kycStatus)}>
                          {patient.kycStatus || "pending"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope className="w-4 h-4" />
                          <span className="truncate">
                            {patient.email || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="w-4 h-4" />
                          <span>{patient.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBirthdayCake className="w-4 h-4" />
                          <span>{calculateAge(patient.dateOfBirth)} years</span>
                        </div>
                        {lastAppointment && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="w-4 h-4" />
                            <span>
                              Last visit: {formatDate(lastAppointment.date)}
                            </span>
                          </div>
                        )}
                      </div>

                      {patient.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/doctor/patients/${patient.id}`)
                        }
                        className="text-primary hover:bg-primary-50">
                        <FaEye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatients;
