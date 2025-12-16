import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FaUserInjured,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaStethoscope,
  FaNotesMedical,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaFileMedical,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [stats, setStats] = useState({
    todayAppointments: 0,
    upcoming: 0,
    totalPatients: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user || !user.doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch today's appointments and stats in parallel
      const [appointmentsResponse, statsResponse] = await Promise.all([
        doctorService.getTodayAppointments(user.doctorId),
        doctorService.getDoctorStats(user.doctorId),
      ]);

      // Transform appointments data to match expected format
      const transformedAppointments = (appointmentsResponse.data || []).map(
        (apt) => ({
          id: apt.id,
          patientId: apt.patient?.id || apt.patientId,
          patient: apt.patient
            ? `${apt.patient.firstName} ${apt.patient.lastName}`
            : apt.patient || "Unknown Patient",
          patientEmail: apt.patient?.email || apt.patientEmail || "",
          patientPhone: apt.patient?.phone || apt.patientPhone || "",
          patientDob: apt.patient?.dateOfBirth || apt.patientDob || "",
          patientAddress: apt.patient?.address || apt.patientAddress || "",
          time: apt.time,
          date: apt.date
            ? typeof apt.date === "string"
              ? apt.date
              : apt.date.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: apt.status || "scheduled",
          type: apt.type || "Consultation",
          notes: apt.notes || "",
        })
      );

      setAppointments(transformedAppointments);
      setStats(
        statsResponse || {
          todayAppointments: transformedAppointments.length,
          upcoming: 0,
          totalPatients: 0,
          completedToday: transformedAppointments.filter(
            (a) => a.status === "completed"
          ).length,
        }
      );
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user?.doctorId]);

  useEffect(() => {
    fetchDashboardData();
  }, [user, fetchDashboardData]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: "primary",
      "in-progress": "info",
      completed: "success",
      cancelled: "danger",
    };
    return variants[status] || "default";
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
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

      // Update stats
      setStats((prev) => ({
        ...prev,
        todayAppointments: prev.todayAppointments,
        completedToday: prev.completedToday + 1,
      }));

      toast.success(result.message || "Appointment accepted successfully!");
      showNotification("Appointment accepted successfully!", "success");
    } catch (error) {
      console.error("Failed to accept appointment:", error);
      
      // Show specific error messages based on error type
      let errorMessage;
      if (error.status === 502 || error.isGatewayError) {
        errorMessage = "The server is temporarily unavailable. Please try again in a few moments.";
      } else if (error.status === 404 || error.isNotFoundError) {
        errorMessage = "Appointment not found. It may have been deleted or already processed.";
      } else if (error.status === 400 || error.isBadRequestError) {
        errorMessage = error.message || "Invalid request. Please check the appointment details.";
      } else if (error.status === 500 || error.isServerError) {
        errorMessage = "Server error occurred. Please try again or contact support.";
      } else if (error.isConnectionError) {
        errorMessage = error.message || "Unable to connect to the server. Please check your internet connection.";
      } else {
        errorMessage = error.message || "Failed to accept appointment. Please try again.";
      }
      
      toast.error(errorMessage, { duration: 5000 });
      showNotification(errorMessage, "error");
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

  // Refresh appointments every 30 seconds
  useEffect(() => {
    if (!user || !user.doctorId) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleViewAllAppointments = () => {
    navigate("/doctor/appointments");
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Notification Toast */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
            {notification.type === "success" ? (
              <FaCheckCircle className="w-5 h-5" />
            ) : (
              <FaExclamationCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() =>
                setNotification({ show: false, message: "", type: "success" })
              }
              className="ml-2 text-gray-400 hover:text-gray-600">
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Doctor Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Today's schedule and patient information
            </p>
          </div>
          <Link to="/doctor/calendar">
            <Button variant="outline">View Calendar</Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Today's Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.todayAppointments}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {
                    appointments.filter(
                      (a) =>
                        a.status === "scheduled" || a.status === "confirmed"
                    ).length
                  }{" "}
                  remaining
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaCalendarAlt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Upcoming
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.upcoming}
                </p>
                <p className="text-xs text-emerald-600 mt-1">Next 7 days</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <FaClock className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalPatients}
                </p>
                <p className="text-xs text-violet-600 mt-1">Active patients</p>
              </div>
              <div className="p-3 rounded-xl bg-violet-100">
                <FaUserInjured className="w-8 h-8 text-violet-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed Today
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completedToday}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Successfully finished
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Today's Appointments
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {appointments.length} appointments scheduled
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewAllAppointments}
                className="text-primary hover:bg-primary-50">
                View All
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No appointments scheduled for today
              </p>
              <p className="text-sm text-gray-400">Enjoy your free day!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
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
                      View Patient
                    </Button>
                    {apt.status === "scheduled" && (
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/doctor/patients">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaUserInjured className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Patient Records
                  </h3>
                  <p className="text-sm text-gray-600">View patient history</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/doctor/calendar">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <FaCalendarAlt className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Appointment Calendar
                  </h3>
                  <p className="text-sm text-gray-600">View full schedule</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/doctor/prescriptions">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <FaNotesMedical className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Prescriptions</h3>
                  <p className="text-sm text-gray-600">Manage prescriptions</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Patient Information"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsPatientModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsPatientModalOpen(false);
                navigate(`/doctor/patients/${selectedPatient?.id}`);
              }}>
              View Full Profile
            </Button>
          </div>
        }>
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaUser className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaBirthdayCake className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth / Age</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedPatient.dob)} (
                    {calculateAge(selectedPatient.dob)} years)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaPhone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaEnvelope className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                <FaMapMarkerAlt className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaIdCard className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="font-semibold text-gray-900">
                    #{selectedPatient.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaFileMedical className="w-4 h-4 text-primary" />
                Appointment Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Appointment Type:</span>
                  <span className="font-medium text-gray-900">
                    {selectedPatient.appointmentType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedPatient.appointmentDate)} at{" "}
                    {selectedPatient.appointmentTime}
                  </span>
                </div>
                {selectedPatient.appointmentNotes && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Notes:</span>
                    <span className="font-medium text-gray-900">
                      {selectedPatient.appointmentNotes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
