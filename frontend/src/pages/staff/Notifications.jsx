import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import toast from 'react-hot-toast';
import { FaBell, FaSpinner, FaCheck, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          title: 'New KYC Submission',
          message: 'Robert Taylor has submitted KYC documents requiring assistance',
          type: 'kyc',
          status: 'unread',
          timestamp: '2 hours ago',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Task Assignment',
          message: 'You have been assigned a new task: Process insurance forms',
          type: 'task',
          status: 'unread',
          timestamp: '5 hours ago',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Appointment Reminder',
          message: 'Reminder: 3 appointments scheduled for tomorrow',
          type: 'appointment',
          status: 'read',
          timestamp: '1 day ago',
          priority: 'low'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, status: 'read' } : notif
      )
    );
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, status: 'read' }))
    );
    toast.success('All notifications marked as read');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-amber-600 bg-amber-100',
      low: 'text-blue-600 bg-blue-100'
    };
    return colors[priority] || colors.low;
  };

  const getTypeIcon = (type) => {
    const icons = {
      kyc: FaExclamationCircle,
      task: FaInfoCircle,
      appointment: FaInfoCircle
    };
    return icons[type] || FaInfoCircle;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">View and manage your notifications</p>
          </div>
          <Button onClick={handleMarkAllAsRead} variant="outline">
            Mark All as Read
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const Icon = getTypeIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start justify-between p-4 rounded-lg transition-colors ${
                      notif.status === 'unread' ? 'bg-blue-50 border-l-4 border-primary' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Icon className={`w-5 h-5 ${getPriorityColor(notif.priority).split(' ')[0]}`} />
                        <p className={`font-semibold ${notif.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </p>
                        <Badge className={getPriorityColor(notif.priority)}>
                          {notif.priority}
                        </Badge>
                        {notif.status === 'unread' && (
                          <Badge variant="primary">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.timestamp}</p>
                    </div>
                    {notif.status === 'unread' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <FaCheck className="w-4 h-4" />
                      </Button>
                    )}
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

export default Notifications;

