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
import { adminApi } from '../../api/admin/adminApi';

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
      setLoading(true);
      
      // Fetch stats, appointments, and KYC in parallel
      const [statsRes, appointmentsRes, patientsRes, kycRes] = await Promise.all([
        adminApi.getStats().catch(() => ({ data: { data: {} } })),
        adminApi.getTodayAppointments().catch(() => ({ data: { data: [] } })),
        adminApi.getPatients({ limit: 1000 }).catch(() => ({ data: { data: [] } })),
        adminApi.getKYCDocuments({ status: 'pending' }).catch(() => ({ data: { data: [] } }))
      ]);

      const statsData = statsRes.data?.data || {};
      
      // Handle different response formats for appointments
      let appointments = [];
      if (appointmentsRes.data?.data) {
        appointments = appointmentsRes.data.data;
      } else if (appointmentsRes.data?.appointments) {
        appointments = appointmentsRes.data.appointments;
      } else if (Array.isArray(appointmentsRes.data)) {
        appointments = appointmentsRes.data;
      }
      
      const patients = patientsRes.data?.data || (Array.isArray(patientsRes.data) ? patientsRes.data : []);
      const kycDocs = kycRes.data?.data || [];

      // Get today's date for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Filter today's appointments
      const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && aptDate < tomorrow;
      });

      // Count active and completed appointments
      const activeAppointments = todayAppointments.filter(apt => 
        ['scheduled', 'confirmed', 'in_progress'].includes(apt.status)
      ).length;
      const completedToday = todayAppointments.filter(apt => 
        apt.status === 'completed'
      ).length;

      // Get doctors count - try multiple endpoints
      let doctors = [];
      try {
        const doctorsRes = await adminApi.getDoctors();
        doctors = doctorsRes.data?.data || doctorsRes.data || [];
      } catch (e) {
        console.warn('Could not fetch doctors:', e);
      }

      // Get staff count
      let staff = [];
      try {
        const staffRes = await adminApi.getStaff();
        staff = staffRes.data?.data || staffRes.data || [];
      } catch (e) {
        console.warn('Could not fetch staff:', e);
      }

      // Set stats
      setStats({
        totalPatients: statsData.totalPatients || patients.length,
        totalDoctors: statsData.totalDoctors || doctors.length,
        totalStaff: statsData.totalStaff || staff.length,
        appointmentsToday: todayAppointments.length,
        pendingKYC: kycDocs.length,
        activeAppointments,
        completedToday
      });

      // Format recent appointments
      const formattedAppointments = appointments.slice(0, 10).map(apt => ({
        id: apt.id,
        patient: `${apt.patient?.firstName || ''} ${apt.patient?.lastName || ''}`.trim(),
        patientId: apt.patient?.id,
        patientEmail: apt.patient?.email,
        patientPhone: apt.patient?.phone,
        doctor: `Dr. ${apt.doctor?.firstName || ''} ${apt.doctor?.lastName || ''}`.trim(),
        department: apt.doctor?.specialization || apt.department || 'General',
        time: apt.time,
        status: apt.status,
        date: apt.date,
        type: apt.type || 'Consultation',
        notes: apt.notes
      }));
      setRecentAppointments(formattedAppointments);

      // Format pending KYC
      const formattedKYC = kycDocs.map((kyc, index) => {
        const submittedDate = new Date(kyc.createdAt || kyc.submittedDate);
        const daysAgo = Math.floor((Date.now() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
        const submitted = daysAgo === 0 ? 'today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
        
        // Count documents
        const docCount = [
          kyc.salarySlip1, kyc.salarySlip2, kyc.salarySlip3,
          kyc.cancelledCheque, kyc.passbook,
          kyc.aadhaarFront, kyc.aadhaarBack,
          kyc.educationalDoc1, kyc.educationalDoc2, kyc.educationalDoc3
        ].filter(Boolean).length;

        return {
          id: kyc.id,
          patient: `${kyc.patient?.firstName || ''} ${kyc.patient?.lastName || ''}`.trim(),
          patientId: kyc.patientId,
          submitted,
          submittedDate: submittedDate.toISOString().split('T')[0],
          documents: docCount,
          status: kyc.status || 'pending',
          priority: daysAgo > 2 ? 'high' : 'medium'
        };
      });
      setPendingKYC(formattedKYC);
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
