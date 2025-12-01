import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import toast from 'react-hot-toast';
import { useConfirm } from '../../hooks/useConfirm';
import { FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaCalendar, FaUserClock } from 'react-icons/fa';
import * as staffService from '../../services/staffService';

const Attendance = () => {
  const { confirm } = useConfirm();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAttendanceStatus();
    fetchAttendanceHistory();
  }, [selectedDate]);

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

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      // Mock attendance history
      setAttendanceHistory([
        {
          id: 1,
          date: '2024-01-19',
          checkIn: '09:00 AM',
          checkOut: '05:30 PM',
          hours: 8.5,
          status: 'present'
        },
        {
          id: 2,
          date: '2024-01-18',
          checkIn: '08:45 AM',
          checkOut: '05:15 PM',
          hours: 8.5,
          status: 'present'
        },
        {
          id: 3,
          date: '2024-01-17',
          checkIn: '09:15 AM',
          checkOut: '05:45 PM',
          hours: 8.5,
          status: 'present'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch attendance history:', error);
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const result = await staffService.checkIn();
      setCheckedIn(true);
      setCheckInTime(result.checkInTime || new Date().toISOString());
      localStorage.setItem('checkInTime', result.checkInTime || new Date().toISOString());
      toast.success(result.message || 'Checked in successfully!');
      fetchAttendanceStatus();
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
          setCheckOutTime(result.checkOutTime || new Date().toISOString());
          localStorage.removeItem('checkInTime');
          localStorage.setItem('checkOutTime', result.checkOutTime || new Date().toISOString());
          toast.success(result.message || `Checked out successfully! You worked ${result.hoursWorked || 8} hours today.`);
          fetchAttendanceStatus();
          fetchAttendanceHistory();
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600 mt-1">Track your daily attendance and work hours</p>
          </div>
        </div>

        {/* Check In/Out Card */}
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
                      <p className="text-sm opacity-90">Checked in at: {checkInTime ? new Date(checkInTime).toLocaleString() : 'N/A'}</p>
                      {checkOutTime && (
                        <p className="text-sm opacity-90">Checked out at: {new Date(checkOutTime).toLocaleString()}</p>
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
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm opacity-80">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Attendance History */}
        <Card title="Attendance History">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading attendance history...</p>
            </div>
          ) : attendanceHistory.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendanceHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">{formatDate(record.date)}</p>
                      {record.status === 'present' ? (
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
                      {record.checkIn && (
                        <span className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          Check-in: {record.checkIn}
                        </span>
                      )}
                      {record.checkOut && (
                        <span className="flex items-center gap-1">
                          <FaUserClock className="w-3 h-3" />
                          Check-out: {record.checkOut}
                        </span>
                      )}
                      {record.hours && (
                        <span className="font-semibold">Hours: {record.hours}</span>
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

