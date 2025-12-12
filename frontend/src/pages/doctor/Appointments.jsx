import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";
import { useAuth } from "../../contexts/AuthContext";
import * as doctorService from "../../services/doctorService";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaNotesMedical,
  FaFilter,
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(null);

  const fetchAppointments = useCallback(async () => {
    console.log("🔍 Fetching appointments...", {
      user,
      doctorId: user?.doctorId,
    });

    if (!user || !user.doctorId) {
      console.warn("⚠️ No user or doctorId found:", { user });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const filters = {};
      if (filter !== "all") {
        filters.status = filter;
      }

      console.log("📡 Calling API with:", { doctorId: user.doctorId, filters });
      const result = await doctorService.getAllAppointments(
        user.doctorId,
        filters
      );
      console.log("📥 API Response:", result);

      // Transform the data to match the expected format
      const transformedAppointments = (result.data || []).map((apt) => ({
        id: apt.id,
        patientId: apt.patientId,
        patient: apt.patient
          ? `${apt.patient.firstName} ${apt.patient.lastName}`
          : "Unknown",
        patientEmail: apt.patient?.email || "",
        patientPhone: apt.patient?.phone || "",
        patientDob: apt.patient?.dateOfBirth || "",
        patientAddress: apt.patient?.address || "",
        time: apt.time || "N/A",
        date: apt.date
          ? typeof apt.date === "string"
            ? apt.date
            : apt.date.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: apt.status || "scheduled",
        type: apt.type || "Consultation",
        notes: apt.notes || "",
        department: apt.department || "",
        patientData: apt.patient, // Keep full patient data for modal
      }));

      console.log(
        "✅ Transformed appointments:",
        transformedAppointments.length
      );
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error("❌ Failed to fetch appointments:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.doctorId, filter]);

  useEffect(() => {
    fetchAppointments();
  }, [user, filter, fetchAppointments]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!user || !user.doctorId) return;

    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing appointments...");
      fetchAppointments();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, filter, fetchAppointments]);

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: "primary",
      confirmed: "primary",
      "in-progress": "info",
      completed: "success",
      cancelled: "danger",
    };
    return variants[status] || "default";
  };

  const handleAcceptAppointment = async (id) => {
    setIsAccepting(id);

    try {
      const result = await doctorService.acceptAppointment(id);

      // Update appointment status
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: "confirmed" } : apt
        )
      );

      toast.success(result.message || "Appointment accepted successfully!");

      // Refresh the list
      await fetchAppointments();
    } catch (error) {
      console.error("Failed to accept appointment:", error);
      toast.error("Failed to accept appointment. Please try again.");
    } finally {
      setIsAccepting(null);
    }
  };

  const handleViewPatient = (appointment) => {
    setSelectedPatient({
      id: appointment.patientId,
      name: appointment.patient,
      email: appointment.patientEmail,
      phone: appointment.patientPhone,
      dob: appointment.patientDob,
      address: appointment.patientAddress,
      appointmentId: appointment.id,
      appointmentType: appointment.type,
      appointmentNotes: appointment.notes,
      appointmentTime: appointment.time,
      appointmentDate: appointment.date,
    });
    setIsPatientModalOpen(true);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.notes && apt.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              All Appointments
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and view all your appointments
            </p>
          </div>
          <Button
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center gap-2">
            <FaCalendarAlt className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by patient name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter */}
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
            <div className="text-center py-8 text-gray-500">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading appointments...</p>
            </div>
          ) : !user || !user.doctorId ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Unable to load appointments</p>
              <p className="text-sm text-gray-400">
                {!user
                  ? "User not logged in"
                  : "Doctor ID not found. Please log out and log in again."}
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No appointments found</p>
              <p className="text-sm text-gray-400">
                {searchTerm
                  ? "Try adjusting your search filters"
                  : "You don't have any appointments yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FaStethoscope className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {apt.patient}
                        </p>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                      </div>
                      <Badge variant={getStatusBadge(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {apt.time}
                      </span>
                      {apt.notes && (
                        <span className="flex items-center gap-1">
                          <FaNotesMedical className="w-3 h-3" />
                          {apt.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPatient(apt)}
                      className="text-primary hover:bg-primary-50">
                      View Details
                    </Button>
                    {(apt.status === "scheduled" ||
                      apt.status === "pending") && (
                      <Button
                        size="sm"
                        onClick={() => handleAcceptAppointment(apt.id)}
                        disabled={isAccepting === apt.id}
                        className="bg-primary text-white hover:bg-primary-600">
                        {isAccepting === apt.id ? (
                          <>
                            <FaSpinner className="w-3 h-3 animate-spin mr-1" />
                            Accepting...
                          </>
                        ) : (
                          "Accept"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Patient Details"
        size="lg">
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <FaUser className="w-3 h-3" />
                  Patient Name
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedPatient.name}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <FaIdCard className="w-3 h-3" />
                  Patient ID
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedPatient.id}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <FaEnvelope className="w-3 h-3" />
                  Email
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedPatient.email || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <FaPhone className="w-3 h-3" />
                  Phone
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedPatient.phone || "N/A"}
                </p>
              </div>

              {selectedPatient.dob && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <FaBirthdayCake className="w-3 h-3" />
                    Date of Birth
                  </p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedPatient.dob).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedPatient.address && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-3 h-3" />
                    Address
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.address}
                  </p>
                </div>
              )}
            </div>

            {/* Appointment Information */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Appointment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Appointment Type</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.appointmentType}
                  </p>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.appointmentDate} at{" "}
                    {selectedPatient.appointmentTime}
                  </p>
                </div>

                {selectedPatient.appointmentNotes && (
                  <div className="p-4 bg-primary-50 rounded-lg md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="font-semibold text-gray-900">
                      {selectedPatient.appointmentNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsPatientModalOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsPatientModalOpen(false);
                  navigate(`/doctor/patients/${selectedPatient.id}`);
                }}>
                View Full Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Appointments;
