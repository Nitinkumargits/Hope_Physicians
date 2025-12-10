import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientLayout from '../../components/patient/PatientLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../contexts/AuthContext';
import * as notificationService from '../../services/notificationService';
import toast from 'react-hot-toast';
import {
  FaBell,
  FaSearch,
  FaFilter,
  FaCheck,
  FaCheckDouble,
  FaTrash,
  FaArchive,
  FaSpinner,
  FaExclamationCircle,
  FaInfoCircle,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaStethoscope
} from 'react-icons/fa';

const PatientNotifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read', 'archived'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'appointment', 'kyc', 'task', 'event', 'system', 'general'
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user || !user.patientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const filters = {};
      
      if (filter !== 'all') {
        filters.status = filter;
      }
      
      if (typeFilter !== 'all') {
        filters.type = typeFilter;
      }
      
      if (debouncedSearchTerm) {
        filters.search = debouncedSearchTerm;
      }

      const response = await notificationService.getPatientNotifications(user.patientId, filters);
      
      if (response.success) {
        setNotifications(response.data || []);
      } else {
        toast.error(response.error || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, filter, typeFilter, debouncedSearchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      setIsMarkingAsRead(notificationId);
      const response = await notificationService.markAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId
              ? { ...notif, status: 'read', readAt: new Date().toISOString() }
              : notif
          )
        );
        toast.success('Notification marked as read');
      } else {
        toast.error(response.error || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    } finally {
      setIsMarkingAsRead(null);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user || !user.patientId) return;

    try {
      const response = await notificationService.markAllPatientAsRead(user.patientId);
      
      if (response.success) {
        setNotifications(prev =>
          prev.map(notif => ({
            ...notif,
            status: 'read',
            readAt: new Date().toISOString()
          }))
        );
        toast.success(response.message || 'All notifications marked as read');
      } else {
        toast.error(response.error || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      setIsDeleting(notificationId);
      const response = await notificationService.deleteNotification(notificationId);
      
      if (response.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        toast.success('Notification deleted successfully');
        if (selectedNotification?.id === notificationId) {
          setIsModalOpen(false);
          setSelectedNotification(null);
        }
      } else {
        toast.error(response.error || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    } finally {
      setIsDeleting(null);
    }
  };

  // Archive notification
  const handleArchive = async (notificationId) => {
    try {
      const response = await notificationService.archiveNotification(notificationId);
      
      if (response.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, status: 'archived' } : notif
          )
        );
        toast.success('Notification archived');
        if (selectedNotification?.id === notificationId) {
          setIsModalOpen(false);
          setSelectedNotification(null);
        }
      } else {
        toast.error(response.error || 'Failed to archive notification');
      }
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast.error('Failed to archive notification');
    }
  };

  // View notification details
  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    
    // Mark as read if unread
    if (notification.status === 'unread') {
      handleMarkAsRead(notification.id);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-red-600 bg-red-100 border-red-300',
      high: 'text-orange-600 bg-orange-100 border-orange-300',
      medium: 'text-yellow-600 bg-yellow-100 border-yellow-300',
      low: 'text-blue-600 bg-blue-100 border-blue-300'
    };
    return colors[priority] || colors.medium;
  };

  // Get type icon
  const getTypeIcon = (type) => {
    const icons = {
      appointment: FaCalendarAlt,
      kyc: FaExclamationCircle,
      task: FaInfoCircle,
      event: FaCalendarAlt,
      system: FaInfoCircle,
      general: FaBell
    };
    return icons[type] || FaBell;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    read: notifications.filter(n => n.status === 'read').length,
    archived: notifications.filter(n => n.status === 'archived').length
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">View and manage your notifications</p>
          </div>
          <div className="flex gap-3">
            {stats.unread > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                <FaCheckDouble className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FaBell className="w-8 h-8 text-gray-400" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              </div>
              <FaExclamationCircle className="w-8 h-8 text-red-400" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold text-green-600">{stats.read}</p>
              </div>
              <FaCheck className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <FaArchive className="w-8 h-8 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="appointment">Appointment</option>
                <option value="kyc">KYC</option>
                <option value="task">Task</option>
                <option value="event">Event</option>
                <option value="system">System</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No notifications found</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm || filter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'You have no notifications at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const Icon = getTypeIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start justify-between p-4 rounded-lg transition-colors border ${
                      notif.status === 'unread'
                        ? 'bg-blue-50 border-l-4 border-primary'
                        : 'bg-gray-50 border-gray-200'
                    } hover:bg-gray-100 cursor-pointer`}
                    onClick={() => handleViewDetails(notif)}
                  >
                    <div className="flex-1 flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          notif.status === 'unread'
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p
                            className={`font-semibold ${
                              notif.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            {notif.title}
                          </p>
                          <Badge className={getPriorityColor(notif.priority)}>
                            {notif.priority}
                          </Badge>
                          <Badge
                            variant={
                              notif.type === 'appointment'
                                ? 'primary'
                                : notif.type === 'kyc'
                                ? 'danger'
                                : 'secondary'
                            }
                          >
                            {notif.type}
                          </Badge>
                          {notif.status === 'unread' && (
                            <Badge variant="primary">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {formatDate(notif.createdAt)}
                          </span>
                          {notif.appointment && (
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              Appointment
                            </span>
                          )}
                          {notif.doctor && (
                            <span className="flex items-center gap-1">
                              <FaStethoscope className="w-3 h-3" />
                              Dr. {notif.doctor.firstName} {notif.doctor.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      {notif.status === 'unread' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notif.id)}
                          disabled={isMarkingAsRead === notif.id}
                          title="Mark as read"
                        >
                          {isMarkingAsRead === notif.id ? (
                            <FaSpinner className="w-4 h-4 animate-spin" />
                          ) : (
                            <FaCheck className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notif.id)}
                        disabled={isDeleting === notif.id}
                        title="Delete"
                      >
                        {isDeleting === notif.id ? (
                          <FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaTrash className="w-4 h-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Notification Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNotification(null);
          }}
          title="Notification Details"
        >
          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    selectedNotification.status === 'unread'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {React.createElement(getTypeIcon(selectedNotification.type), {
                    className: 'w-6 h-6'
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedNotification.title}
                    </h3>
                    <Badge className={getPriorityColor(selectedNotification.priority)}>
                      {selectedNotification.priority}
                    </Badge>
                    <Badge
                      variant={
                        selectedNotification.type === 'appointment'
                          ? 'primary'
                          : selectedNotification.type === 'kyc'
                          ? 'danger'
                          : 'secondary'
                      }
                    >
                      {selectedNotification.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {formatDate(selectedNotification.createdAt)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.appointment && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Related Appointment</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(selectedNotification.appointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Time:</span>{' '}
                      {selectedNotification.appointment.time}
                    </p>
                    {selectedNotification.appointment.doctor && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Doctor:</span>{' '}
                        Dr. {selectedNotification.appointment.doctor.firstName}{' '}
                        {selectedNotification.appointment.doctor.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedNotification.doctor && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Related Doctor</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Dr. {selectedNotification.doctor.firstName}{' '}
                      {selectedNotification.doctor.lastName}
                    </p>
                    {selectedNotification.doctor.specialization && (
                      <p className="text-sm text-gray-600">
                        {selectedNotification.doctor.specialization}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                {selectedNotification.status === 'unread' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleMarkAsRead(selectedNotification.id);
                    }}
                    disabled={isMarkingAsRead === selectedNotification.id}
                  >
                    {isMarkingAsRead === selectedNotification.id ? (
                      <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <FaCheck className="w-4 h-4 mr-2" />
                    )}
                    Mark as Read
                  </Button>
                )}
                {selectedNotification.status !== 'archived' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleArchive(selectedNotification.id);
                    }}
                  >
                    <FaArchive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDelete(selectedNotification.id);
                  }}
                  disabled={isDeleting === selectedNotification.id}
                >
                  {isDeleting === selectedNotification.id ? (
                    <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <FaTrash className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PatientLayout>
  );
};

export default PatientNotifications;

