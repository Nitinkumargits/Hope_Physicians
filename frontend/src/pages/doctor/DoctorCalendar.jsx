import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { useAuth } from '../../contexts/AuthContext';
import * as doctorService from '../../services/doctorService';
import toast from 'react-hot-toast';
import { 
  FaCalendarAlt, 
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaUser,
  FaStethoscope,
  FaSpinner,
  FaEye,
  FaFilter
} from 'react-icons/fa';

const DoctorCalendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [filter, setFilter] = useState('all'); // all, scheduled, confirmed, completed, cancelled

  useEffect(() => {
    if (user && user.doctorId) {
      fetchAppointments();
    } else {
      setLoading(false);
      toast.error('Doctor ID not found. Please log in again.');
    }
  }, [user, currentDate, filter]);

  const fetchAppointments = async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Calculate date range for the current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      const filters = {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
      };
      
      if (filter !== 'all') {
        filters.status = filter;
      }

      const response = await doctorService.getAllAppointments(user.doctorId, filters);
      
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return appointments.filter(apt => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date);
      const aptDateStr = `${aptDate.getFullYear()}-${String(aptDate.getMonth() + 1).padStart(2, '0')}-${String(aptDate.getDate()).padStart(2, '0')}`;
      return aptDateStr === dateStr;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'confirmed':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);
  const calendarDays = renderCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Calendar</h1>
            <p className="text-gray-600 mt-1">View and manage your appointment schedule</p>
          </div>
          <Button onClick={navigateToToday} variant="outline">
            Today
          </Button>
        </div>

        {/* Calendar Navigation and Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="p-2"
              >
                <FaChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="p-2"
              >
                <FaChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <Card className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          ) : (
            <>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-semibold text-gray-700 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dayAppointments = getAppointmentsForDate(date);
                  const isCurrentDay = isToday(date);
                  const isCurrentSelected = isSelected(date);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`
                        aspect-square p-2 rounded-lg border-2 transition-all
                        ${isCurrentSelected 
                          ? 'border-primary bg-primary-50' 
                          : isCurrentDay
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                        ${dayAppointments.length > 0 ? 'font-semibold' : ''}
                      `}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`
                          text-sm mb-1
                          ${isCurrentSelected ? 'text-primary' : isCurrentDay ? 'text-blue-600' : 'text-gray-700'}
                        `}>
                          {date.getDate()}
                        </span>
                        {dayAppointments.length > 0 && (
                          <div className="flex-1 flex items-center justify-center">
                            <div className={`
                              w-2 h-2 rounded-full
                              ${isCurrentSelected ? 'bg-primary' : 'bg-blue-500'}
                            `} />
                          </div>
                        )}
                        {dayAppointments.length > 1 && (
                          <span className="text-xs text-gray-500 mt-auto">
                            +{dayAppointments.length - 1}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        {/* Selected Date Appointments */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Appointments for {formatDate(selectedDate.toISOString())}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {selectedDateAppointments.length === 0 ? (
              <div className="text-center py-8">
                <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateAppointments.map((apt) => {
                  const patientName = apt.patient 
                    ? `${apt.patient.firstName} ${apt.patient.lastName}`
                    : 'Unknown Patient';
                  
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <FaStethoscope className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{patientName}</p>
                            <p className="text-sm text-gray-600">{apt.type || 'Consultation'}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(apt.status)}>
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {apt.time || 'N/A'}
                          </span>
                          {apt.patient?.phone && (
                            <span className="flex items-center gap-1">
                              <FaUser className="w-3 h-3" />
                              {apt.patient.phone}
                            </span>
                          )}
                        </div>
                        {apt.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">{apt.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/doctor/patients/${apt.patientId}`)}
                          className="text-primary hover:bg-primary-50"
                        >
                          <FaEye className="w-4 h-4 mr-1" />
                          View Patient
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total This Month</p>
                <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaCalendarAlt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <FaClock className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <FaStethoscope className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today</p>
                <p className="text-3xl font-bold text-gray-900">
                  {getAppointmentsForDate(new Date()).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-violet-100">
                <FaUser className="w-8 h-8 text-violet-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorCalendar;

