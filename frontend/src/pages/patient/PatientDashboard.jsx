import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/portal/DashboardLayout';
import { useConfirm } from '../../hooks/useConfirm';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { 
  FaCalendarAlt, 
  FaFileMedical, 
  FaBell,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserMd,
  FaCalendarCheck,
  FaNotesMedical,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaEdit
} from 'react-icons/fa';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    pendingKYC: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch appointments
    setTimeout(() => {
      const mockAppointments = [
        { 
          id: 1, 
          doctor: 'Dr. Okonkwo', 
          department: 'Family Medicine',
          date: '2024-01-25', 
          time: '10:00 AM', 
          status: 'scheduled',
          type: 'Follow-up',
          notes: 'Regular checkup',
          location: 'Main Clinic - Room 101',
          doctorPhone: '(252) 555-0100',
          doctorEmail: 'dr.okonkwo@hopephysicians.com',
          reason: 'Follow-up appointment for ongoing treatment',
          duration: '30 minutes'
        },
        { 
          id: 2, 
          doctor: 'Dr. Williams', 
          department: 'Cardiology',
          date: '2024-01-28', 
          time: '02:30 PM', 
          status: 'scheduled',
          type: 'Consultation',
          notes: 'Cardiac evaluation',
          location: 'Cardiology Wing - Room 205',
          doctorPhone: '(252) 555-0101',
          doctorEmail: 'dr.williams@hopephysicians.com',
          reason: 'Initial consultation for heart health',
          duration: '45 minutes'
        },
        { 
          id: 3, 
          doctor: 'Dr. Okonkwo', 
          department: 'Family Medicine',
          date: '2024-01-15', 
          time: '11:00 AM', 
          status: 'completed',
          type: 'Checkup',
          notes: 'Annual physical examination',
          location: 'Main Clinic - Room 101',
          doctorPhone: '(252) 555-0100',
          doctorEmail: 'dr.okonkwo@hopephysicians.com',
          reason: 'Annual health checkup',
          duration: '30 minutes',
          diagnosis: 'Healthy, no issues found',
          prescription: 'Continue current medications'
        }
      ];
      
      setAppointments(mockAppointments);
      
      // Calculate stats dynamically
      setStats({
        upcoming: mockAppointments.filter(a => a.status === 'scheduled').length,
        completed: mockAppointments.filter(a => a.status === 'completed').length,
        pendingKYC: 1
      });
      
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'completed': 'success',
      'cancelled': 'danger',
      'pending': 'warning'
    };
    return variants[status] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleForm({
      date: appointment.date,
      time: appointment.time,
      reason: ''
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rescheduleForm.date || !rescheduleForm.time) {
      toast.error('Please select both date and time');
      return;
    }

    setIsRescheduling(true);

    // Simulate API call
    setTimeout(() => {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { 
                ...apt, 
                date: rescheduleForm.date,
                time: rescheduleForm.time,
                notes: rescheduleForm.reason ? `${apt.notes} (Rescheduled: ${rescheduleForm.reason})` : apt.notes
              }
            : apt
        )
      );
      
      setIsRescheduling(false);
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
      setRescheduleForm({ date: '', time: '', reason: '' });
      toast.success('Appointment rescheduled successfully!');
    }, 1000);
  };

  const handleCancelAppointment = (appointmentId) => {
    confirm(
      'Are you sure you want to cancel this appointment?',
      () => {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: 'cancelled' }
              : apt
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          upcoming: prev.upcoming - 1
        }));
        
        toast.success('Appointment cancelled successfully');
      },
      () => {
        // User cancelled
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your appointments and health records</p>
          </div>
          <Link to="/patient/book-appointment">
            <Button className="bg-primary text-white hover:bg-primary-600">
              <FaCalendarCheck className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
                <p className="text-xs text-blue-600 mt-1">Next appointments</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaCalendarAlt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-xs text-green-600 mt-1">Total visits</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">KYC Status</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingKYC}</p>
                <p className="text-xs text-amber-600 mt-1">Pending review</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <FaFileMedical className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/patient/book-appointment">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaCalendarCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                  <p className="text-sm text-gray-600">Schedule a new visit</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/patient/kyc-documents">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <FaFileMedical className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">KYC Documents</h3>
                  <p className="text-sm text-gray-600">Upload and track documents</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/patient/notifications">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <FaBell className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">View messages and updates</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <Card className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
              <p className="text-sm text-gray-500 mt-1">Your scheduled visits</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/patient/appointments')}
                className="text-primary hover:bg-primary-50"
              >
                View All
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading appointments...</p>
            </div>
          ) : appointments.filter(a => a.status === 'scheduled').length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <Link to="/patient/book-appointment">
                <Button>Book Your First Appointment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments
                .filter(apt => apt.status === 'scheduled')
                .map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FaUserMd className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{apt.doctor}</p>
                          <p className="text-sm text-gray-600">{apt.department}</p>
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
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {apt.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(apt)}
                        className="text-primary hover:bg-primary-50"
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReschedule(apt)}
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* Recent Appointments */}
        <Card className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Appointments</h3>
              <p className="text-sm text-gray-500 mt-1">Your appointment history</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : appointments.filter(a => a.status === 'completed').length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recent appointments</div>
          ) : (
            <div className="space-y-3">
              {appointments
                .filter(apt => apt.status === 'completed')
                .map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(apt)}
                  >
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">{apt.doctor}</p>
                        <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                      </div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Appointment Details"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
            {selectedAppointment?.status === 'scheduled' && (
              <Button onClick={() => {
                setIsDetailsModalOpen(false);
                handleReschedule(selectedAppointment);
              }}>
                <FaEdit className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            )}
          </div>
        }
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Doctor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Doctor</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.doctor}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedAppointment.department}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Appointment Type</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.type}</p>
                <p className="text-sm text-gray-600 mt-1">Duration: {selectedAppointment.duration || '30 minutes'}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(selectedAppointment.date)}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedAppointment.date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaClock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900">{selectedAppointment.time}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            {selectedAppointment.location && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaMapMarkerAlt className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">{selectedAppointment.location}</p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedAppointment.doctorPhone && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaPhone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.doctorPhone}</p>
                  </div>
                </div>
              )}
              
              {selectedAppointment.doctorEmail && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.doctorEmail}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedAppointment.notes && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaNotesMedical className="w-4 h-4 text-primary" />
                  Notes
                </p>
                <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
              </div>
            )}

            {/* Reason */}
            {selectedAppointment.reason && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">Reason for Visit</p>
                <p className="text-sm text-gray-700">{selectedAppointment.reason}</p>
              </div>
            )}

            {/* Completed Appointment Details */}
            {selectedAppointment.status === 'completed' && (
              <>
                {selectedAppointment.diagnosis && (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Diagnosis</p>
                    <p className="text-sm text-gray-700">{selectedAppointment.diagnosis}</p>
                  </div>
                )}
                
                {selectedAppointment.prescription && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Prescription</p>
                    <p className="text-sm text-gray-700">{selectedAppointment.prescription}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedAppointment(null);
          setRescheduleForm({ date: '', time: '', reason: '' });
        }}
        title="Reschedule Appointment"
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRescheduleModalOpen(false);
                setSelectedAppointment(null);
                setRescheduleForm({ date: '', time: '', reason: '' });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRescheduleSubmit}
              disabled={isRescheduling}
              className="bg-primary text-white hover:bg-primary-600"
            >
              {isRescheduling ? (
                <>
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </Button>
          </div>
        }
      >
        {selectedAppointment && (
          <form onSubmit={handleRescheduleSubmit} className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
              <p className="text-sm font-semibold text-gray-900 mb-1">Current Appointment</p>
              <p className="text-sm text-gray-700">
                {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedAppointment.doctor} - {selectedAppointment.department}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={rescheduleForm.date}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={rescheduleForm.time}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rescheduling (Optional)
              </label>
              <textarea
                value={rescheduleForm.reason}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please provide a reason for rescheduling..."
              />
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default PatientDashboard;
