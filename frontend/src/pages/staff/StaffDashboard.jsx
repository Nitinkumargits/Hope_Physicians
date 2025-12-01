import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import Modal from '../../components/shared/Modal';
import toast from 'react-hot-toast';
import { useConfirm } from '../../hooks/useConfirm';
import * as staffService from '../../services/staffService';
import { 
  FaClock, 
  FaCheckCircle, 
  FaFileMedical,
  FaTasks,
  FaUserClock,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaUsers,
  FaSpinner,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCalendar,
  FaFileAlt,
  FaPlay,
  FaStop
} from 'react-icons/fa';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [kycAssistance, setKycAssistance] = useState([]);
  const [stats, setStats] = useState({
    tasksCompleted: 12,
    tasksPending: 5,
    kycPending: 3
  });
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [assistingKYC, setAssistingKYC] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchAttendanceStatus();
    
    // Update clock every second
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, tasksData, kycData] = await Promise.all([
        staffService.getStaffDashboardStats(),
        staffService.getTasks(),
        staffService.getKYCAssistance()
      ]);
      
      setStats(statsData);
      setTasks(tasksData.data || []);
      setKycAssistance(kycData.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceStatus = async () => {
    try {
      const status = await staffService.getAttendanceStatus();
      setCheckedIn(status.checkedIn);
      setCheckInTime(status.checkInTime);
      setCheckOutTime(status.checkOutTime);
    } catch (error) {
      console.error('Failed to fetch attendance status:', error);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const result = await staffService.checkIn();
      setCheckedIn(true);
      setCheckInTime(result.checkInTime || new Date().toLocaleString());
      localStorage.setItem('checkInTime', result.checkInTime || new Date().toISOString());
      toast.success(result.message || 'Checked in successfully!');
    } catch (error) {
      console.error('Check-in failed:', error);
      toast.error('Failed to check in. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    confirm(
      'Are you sure you want to check out?',
      async () => {
        setCheckingOut(true);
        try {
          const result = await staffService.checkOut();
          setCheckedIn(false);
          setCheckOutTime(result.checkOutTime || new Date().toLocaleString());
          localStorage.removeItem('checkInTime');
          localStorage.setItem('checkOutTime', result.checkOutTime || new Date().toISOString());
          toast.success(result.message || `Checked out successfully! You worked ${result.hoursWorked || 8} hours today.`);
        } catch (error) {
          console.error('Check-out failed:', error);
          toast.error('Failed to check out. Please try again.');
        } finally {
          setCheckingOut(false);
        }
      },
      () => {
        // User cancelled
      }
    );
  };

  const handleStartTask = async (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const confirmStartTask = async () => {
    if (!selectedTask) return;
    
    try {
      const result = await staffService.startTask(selectedTask.id);
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, status: 'in-progress' } : t
      ));
      // Update stats - task moves from pending to in-progress
      setStats(prev => ({ 
        ...prev, 
        tasksPending: Math.max(0, prev.tasksPending - 1)
      }));
      toast.success(result.message || 'Task started successfully!');
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to start task:', error);
      toast.error('Failed to start task. Please try again.');
    }
  };

  const handleAssistKYC = async (kyc) => {
    setSelectedKYC(kyc);
    setIsKYCModalOpen(true);
  };

  const confirmAssistKYC = async () => {
    if (!selectedKYC) return;
    
    setAssistingKYC(true);
    try {
      const result = await staffService.assistKYC(selectedKYC.id);
      setKycAssistance(prev => prev.filter(k => k.id !== selectedKYC.id));
      setStats(prev => ({ 
        ...prev, 
        kycPending: Math.max(0, prev.kycPending - 1),
        tasksCompleted: prev.tasksCompleted + 1
      }));
      toast.success(result.message || 'KYC assistance provided successfully!');
      setIsKYCModalOpen(false);
      setSelectedKYC(null);
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to assist KYC:', error);
      toast.error('Failed to provide assistance. Please try again.');
    } finally {
      setAssistingKYC(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'red',
      'medium': 'amber',
      'low': 'green'
    };
    return colors[priority] || 'gray';
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your attendance and tasks</p>
          </div>
          <div className="flex gap-3">
            <Link to="/staff/tasks">
              <Button variant="outline">View All Tasks</Button>
            </Link>
          </div>
        </div>

        {/* Attendance Card */}
        <Card className={`p-6 bg-gradient-to-r ${checkedIn ? 'from-green-500 to-green-600' : 'from-primary to-primary-600'} text-white border-0`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {!checkedIn ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <FaClock className="w-8 h-8 opacity-90" />
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Ready to check in?</h3>
                      <p className="text-sm opacity-90">Start your workday by checking in</p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    loading={checkingIn}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    {!checkingIn && <FaCheckCircle className="w-5 h-5 mr-2" />}
                    {checkingIn ? 'Checking In...' : 'Check In'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <FaCheckCircle className="w-8 h-8 opacity-90" />
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Checked In</h3>
                      <p className="text-sm opacity-90">Checked in at: {checkInTime}</p>
                      {checkOutTime && (
                        <p className="text-sm opacity-90">Checked out at: {checkOutTime}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleCheckOut}
                    disabled={checkingOut}
                    loading={checkingOut}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    {!checkingOut && <FaUserClock className="w-5 h-5 mr-2" />}
                    {checkingOut ? 'Checking Out...' : 'Check Out'}
                  </Button>
                </>
              )}
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-4xl font-bold opacity-90">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-sm opacity-80">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/staff/tasks')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.tasksCompleted}</p>
                <p className="text-xs text-blue-600 mt-1">Today</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaCheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/staff/tasks')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.tasksPending}</p>
                <p className="text-xs text-amber-600 mt-1">Requires attention</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <FaTasks className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/staff/kyc-assistance')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">KYC Pending</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.kycPending}</p>
                <p className="text-xs text-red-600 mt-1">Needs assistance</p>
              </div>
              <div className="p-3 rounded-xl bg-red-100">
                <FaFileMedical className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <Card 
            title="Today's Tasks" 
            actions={
              <Link to="/staff/tasks">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p>Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No tasks available</div>
              ) : (
                tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    task.status === 'completed' 
                      ? 'bg-green-50 border-green-400' 
                      : 'bg-gray-50 border-' + getPriorityColor(task.priority) + '-400'
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        {task.status === 'pending' && (
                          <Badge variant={getPriorityColor(task.priority) === 'red' ? 'danger' : getPriorityColor(task.priority) === 'amber' ? 'warning' : 'success'}>
                            {task.priority}
                          </Badge>
                        )}
                        {task.status === 'completed' && (
                          <Badge variant="success">Completed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{task.count} items</p>
                    </div>
                    {task.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleStartTask(task)}
                      >
                        <FaPlay className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {task.status === 'completed' && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <FaCheckCircle className="w-3 h-3" />
                        Done
                      </Badge>
                    )}
                  </div>
                </div>
                ))
              )}
            </div>
          </Card>

          {/* KYC Assistance */}
          <Card 
            title="KYC Assistance Requests" 
            actions={
              <Link to="/staff/kyc-assistance">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p>Loading KYC requests...</p>
                </div>
              ) : kycAssistance.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No KYC assistance requests</div>
              ) : (
                kycAssistance.map((kyc) => (
                  <div 
                    key={kyc.id} 
                    className="p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FaUsers className="w-4 h-4 text-amber-600" />
                          <p className="font-semibold text-gray-900">{kyc.patient}</p>
                          <Badge variant="warning">{kyc.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Submitted {kyc.submitted}</p>
                        <p className="text-xs text-gray-500">{kyc.documents} documents uploaded</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleAssistKYC(kyc)}
                      >
                        Assist
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/staff/tasks">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaTasks className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">My Tasks</p>
              </div>
            </Link>
            <Link to="/staff/kyc-assistance">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaFileMedical className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">KYC Assistance</p>
              </div>
            </Link>
            <Link to="/staff/appointments">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaCalendarAlt className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Appointments</p>
              </div>
            </Link>
            <Link to="/staff/attendance">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaUserClock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Attendance</p>
              </div>
            </Link>
          </div>
        </Card>

        {/* Task Details Modal */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title="Task Details"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
              {selectedTask && (
                <Button onClick={confirmStartTask}>
                  <FaPlay className="w-4 h-4 mr-2" />
                  Start Task
                </Button>
              )}
            </div>
          }
        >
          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedTask.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedTask.description || 'No description available'}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Priority:</p>
                    <Badge variant={selectedTask.priority === 'high' ? 'danger' : selectedTask.priority === 'medium' ? 'warning' : 'success'}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">Items:</p>
                    <p className="font-medium text-gray-900">{selectedTask.count} items</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category:</p>
                    <p className="font-medium text-gray-900">{selectedTask.category || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due Date:</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedTask.dueDate)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <FaExclamationTriangle className="w-4 h-4 inline mr-2" />
                  Starting this task will mark it as in-progress. You can complete it from the Tasks page.
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* KYC Assistance Modal */}
        <Modal
          isOpen={isKYCModalOpen}
          onClose={() => setIsKYCModalOpen(false)}
          title="KYC Assistance"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsKYCModalOpen(false)}>Cancel</Button>
              {selectedKYC && (
                <Button 
                  onClick={confirmAssistKYC}
                  disabled={assistingKYC}
                  loading={assistingKYC}
                >
                  <FaCheckCircle className="w-4 h-4 mr-2" />
                  Provide Assistance
                </Button>
              )}
            </div>
          }
        >
          {selectedKYC && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaUsers className="w-4 h-4 text-primary" />
                  Patient Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Name:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patient}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Patient ID:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patientId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patientEmail}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaFileMedical className="w-4 h-4 text-amber-600" />
                  KYC Submission Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="font-medium text-gray-900">{selectedKYC.submitted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant="warning">{selectedKYC.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Documents:</span>
                    <span className="font-medium text-gray-900">{selectedKYC.documents} uploaded</span>
                  </div>
                  {selectedKYC.documentsList && (
                    <div className="mt-3">
                      <p className="text-gray-500 mb-2">Document Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedKYC.documentsList.map((doc, idx) => (
                          <Badge key={idx} variant="info">{doc}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <FaExclamationTriangle className="w-4 h-4 inline mr-2" />
                  Review the patient's documents and provide assistance as needed. This will mark the request as assisted.
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
