import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { 
  FaUsers, 
  FaUserMd, 
  FaCalendarAlt, 
  FaFileMedical, 
  FaClock,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowUp,
  FaSpinner,
  FaEye,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import * as adminService from '../../services/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalStaff: 0,
    appointmentsToday: 0,
    pendingKYC: 0,
    activeAppointments: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [pendingKYC, setPendingKYC] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const data = await adminService.getDashboardStats();
      setStats({
        totalPatients: data.totalPatients || 1247,
        totalDoctors: data.totalDoctors || 24,
        totalStaff: data.totalStaff || 48,
        appointmentsToday: data.appointmentsToday || 32,
        pendingKYC: data.pendingKYC || 8,
        activeAppointments: 18,
        completedToday: 14
      });
      
      // Mock recent appointments with more details
      setRecentAppointments([
        { 
          id: 1, 
          patient: 'John Doe', 
          patientId: 101,
          patientEmail: 'john.doe@example.com',
          patientPhone: '(252) 555-0101',
          doctor: 'Dr. Okonkwo', 
          department: 'Family Medicine',
          time: '10:00 AM', 
          status: 'scheduled', 
          date: new Date().toISOString().split('T')[0],
          type: 'Follow-up',
          notes: 'Regular checkup appointment'
        },
        { 
          id: 2, 
          patient: 'Jane Smith', 
          patientId: 102,
          patientEmail: 'jane.smith@example.com',
          patientPhone: '(252) 555-0102',
          doctor: 'Dr. Williams', 
          department: 'Cardiology',
          time: '11:30 AM', 
          status: 'in-progress', 
          date: new Date().toISOString().split('T')[0],
          type: 'Consultation',
          notes: 'Cardiac evaluation in progress'
        },
        { 
          id: 3, 
          patient: 'Mike Johnson', 
          patientId: 103,
          patientEmail: 'mike.johnson@example.com',
          patientPhone: '(252) 555-0103',
          doctor: 'Dr. Okonkwo', 
          department: 'Family Medicine',
          time: '02:00 PM', 
          status: 'completed', 
          date: new Date().toISOString().split('T')[0],
          type: 'Checkup',
          notes: 'Annual physical completed'
        },
        { 
          id: 4, 
          patient: 'Sarah Brown', 
          patientId: 104,
          patientEmail: 'sarah.brown@example.com',
          patientPhone: '(252) 555-0104',
          doctor: 'Dr. Williams', 
          department: 'Cardiology',
          time: '03:30 PM', 
          status: 'scheduled', 
          date: new Date().toISOString().split('T')[0],
          type: 'Follow-up',
          notes: 'Post-treatment follow-up'
        }
      ]);

      // Mock pending KYC with more details
      setPendingKYC([
        { 
          id: 1, 
          patient: 'Robert Taylor', 
          patientId: 201,
          submitted: '2 days ago',
          submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documents: 3,
          status: 'pending',
          priority: 'high'
        },
        { 
          id: 2, 
          patient: 'Emily Davis', 
          patientId: 202,
          submitted: '1 day ago',
          submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documents: 2,
          status: 'pending',
          priority: 'medium'
        },
        { 
          id: 3, 
          patient: 'David Wilson', 
          patientId: 203,
          submitted: '3 days ago',
          submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documents: 4,
          status: 'pending',
          priority: 'high'
        },
        {
          id: 4,
          patient: 'Lisa Anderson',
          patientId: 204,
          submitted: '5 hours ago',
          submittedDate: new Date().toISOString().split('T')[0],
          documents: 5,
          status: 'pending',
          priority: 'high'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  const handleViewKYC = (kycId) => {
    navigate(`/admin/kyc-review/${kycId}`);
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

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: FaUsers,
      color: 'blue',
      change: '+12%',
      trend: 'up',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: 'emerald',
      change: '+5%',
      trend: 'up',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: FaUsers,
      color: 'violet',
      change: '+3%',
      trend: 'up',
      bgGradient: 'from-violet-50 to-violet-100',
      borderColor: 'border-violet-200'
    },
    {
      title: 'Appointments Today',
      value: stats.appointmentsToday,
      icon: FaCalendarAlt,
      color: 'amber',
      change: '+8%',
      trend: 'up',
      bgGradient: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Pending KYC',
      value: stats.pendingKYC,
      icon: FaFileMedical,
      color: 'red',
      change: 'Review needed',
      trend: 'neutral',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'danger',
      'pending': 'warning'
    };
    return variants[status] || 'default';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/employees">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
                Manage Employees
              </Button>
            </Link>
            <Link to="/admin/kyc-review">
              <Button className="bg-primary text-white hover:bg-primary-600">
                Review KYC
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
              emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
              violet: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' },
              amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
              red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
            };
            const colorClass = colorClasses[stat.color] || colorClasses.blue;
            
            return (
              <Card 
                key={idx} 
                className={`p-6 bg-gradient-to-br ${stat.bgGradient} border-2 ${colorClass.border} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                onClick={() => {
                  if (stat.title === 'Pending KYC') {
                    navigate('/admin/kyc-review');
                  } else if (stat.title === 'Appointments Today') {
                    navigate('/admin/appointments');
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorClass.bg}`}>
                    <Icon className={`w-6 h-6 ${colorClass.text}`} />
                  </div>
                  {stat.trend === 'up' && (
                    <div className="flex items-center text-green-600 text-sm">
                      <FaArrowUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  )}
                  {stat.trend === 'neutral' && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? (
                      <FaSpinner className="w-6 h-6 animate-spin inline" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/appointments')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAppointments}</p>
                <p className="text-xs text-green-600 mt-1">Currently in progress</p>
              </div>
              <FaCheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/appointments')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
                <p className="text-xs text-blue-600 mt-1">Successfully finished</p>
              </div>
              <FaChartLine className="w-10 h-10 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/kyc-review')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingKYC}</p>
                <p className="text-xs text-amber-600 mt-1">Requires attention</p>
              </div>
              <FaExclamationTriangle className="w-10 h-10 text-amber-500" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <Card className="bg-white rounded-lg shadow-md p-6 h-full">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Recent Appointments</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin/appointments')}
                  className="text-primary hover:bg-primary-50"
                >
                  View All
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Loading appointments...</p>
                </div>
              ) : recentAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent appointments</div>
              ) : (
                recentAppointments.slice(0, 4).map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleViewAppointment(apt)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-gray-900">{apt.patient}</p>
                        <Badge variant={getStatusBadge(apt.status)}>{apt.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{apt.doctor} - {apt.department}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAppointment(apt);
                      }}
                      className="text-primary hover:bg-primary-50"
                    >
                      <FaEye className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Pending KYC Reviews */}
          <Card className="bg-white rounded-lg shadow-md p-6 h-full">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Pending KYC Reviews</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin/kyc-review')}
                  className="text-primary hover:bg-primary-50"
                >
                  Review All
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Loading KYC reviews...</p>
                </div>
              ) : pendingKYC.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending KYC reviews</div>
              ) : (
                pendingKYC.slice(0, 4).map((kyc) => (
                  <div 
                    key={kyc.id} 
                    className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                    onClick={() => handleViewKYC(kyc.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-gray-900">{kyc.patient}</p>
                        <Badge variant="warning">Pending</Badge>
                        {kyc.priority === 'high' && (
                          <Badge variant="danger" className="text-xs">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Submitted {kyc.submitted}</p>
                      <p className="text-xs text-gray-500">{kyc.documents} documents uploaded</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewKYC(kyc.id);
                      }}
                      className="bg-primary text-white hover:bg-primary-600"
                    >
                      Review
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/employees">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaUsers className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Manage Employees</p>
              </div>
            </Link>
            <Link to="/admin/kyc-review">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaFileMedical className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">KYC Review</p>
              </div>
            </Link>
            <Link to="/admin/appointments">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaCalendarAlt className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Appointments</p>
              </div>
            </Link>
            <Link to="/admin/reports">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaChartLine className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Reports</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        title="Appointment Details"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsAppointmentModalOpen(false)}>
              Close
            </Button>
            {selectedAppointment && (
              <Button onClick={() => {
                setIsAppointmentModalOpen(false);
                handleViewPatient(selectedAppointment.patientId);
              }}>
                View Patient Profile
              </Button>
            )}
          </div>
        }
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaUser className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">{selectedAppointment.patient}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaUserMd className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-semibold text-gray-900">{selectedAppointment.doctor}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.department}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedAppointment.patientPhone && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaPhone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.patientPhone}</p>
                  </div>
                </div>
              )}
              
              {selectedAppointment.patientEmail && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.patientEmail}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(selectedAppointment.date)}</p>
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

            {/* Status and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <Badge variant={getStatusBadge(selectedAppointment.status)}>
                  {selectedAppointment.status}
                </Badge>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Appointment Type</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.type}</p>
              </div>
            </div>

            {/* Notes */}
            {selectedAppointment.notes && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-semibold text-gray-900 mb-2">Notes</p>
                <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboard;
