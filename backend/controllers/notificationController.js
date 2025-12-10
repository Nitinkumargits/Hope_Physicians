// controllers/notificationController.js
const { prisma } = require('../src/lib/prisma.js');

const notificationController = {
  // Get notifications for the logged-in doctor
  getDoctorNotifications: async (req, res) => {
    try {
      const { status, type, unreadOnly, search } = req.query;
      
      // Get doctorId from authenticated user
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      } else if (req.params.doctorId) {
        doctorId = req.params.doctorId;
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          error: 'Doctor ID is required'
        });
      }

      const where = { doctorId };

      // Filter by status
      if (status) {
        where.status = status;
      } else if (unreadOnly === 'true' || unreadOnly === true) {
        where.status = 'unread';
      }

      // Filter by type
      if (type) {
        where.type = type;
      }

      // Search in title and message (SQLite compatible)
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { message: { contains: search } }
        ];
      }

      // Fetch notifications with related data
      // Note: appointment relation is not defined in schema, so we fetch it separately if needed
      const notifications = await prisma.notification.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true
            }
          },
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Fetch appointment data separately for notifications that have appointmentId
      const notificationsWithAppointments = await Promise.all(
        notifications.map(async (notif) => {
          if (notif.appointmentId) {
            try {
              const appointment = await prisma.appointment.findUnique({
                where: { id: notif.appointmentId },
                select: {
                  id: true,
                  date: true,
                  time: true,
                  patient: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true
                    }
                  }
                }
              });
              return { ...notif, appointment };
            } catch (error) {
              console.error(`Error fetching appointment ${notif.appointmentId}:`, error);
              return notif;
            }
          }
          return notif;
        })
      );

      return res.json({
        success: true,
        data: notificationsWithAppointments,
        total: notificationsWithAppointments.length
      });
    } catch (error) {
      console.error('❌ Error fetching doctor notifications:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Get unread notification count
  getUnreadCount: async (req, res) => {
    try {
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      } else if (req.params.doctorId) {
        doctorId = req.params.doctorId;
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          error: 'Doctor ID is required'
        });
      }

      const count = await prisma.notification.count({
        where: {
          doctorId,
          status: 'unread'
        }
      });

      return res.json({
        success: true,
        count
      });
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch unread count',
        message: error.message
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      // Verify the notification belongs to the logged-in doctor
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      }

      if (doctorId && notification.doctorId !== doctorId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to access this notification'
        });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: {
          status: 'read',
          readAt: new Date()
        }
      });

      return res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read',
        message: error.message
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      } else if (req.params.doctorId) {
        doctorId = req.params.doctorId;
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          error: 'Doctor ID is required'
        });
      }

      const result = await prisma.notification.updateMany({
        where: {
          doctorId,
          status: 'unread'
        },
        data: {
          status: 'read',
          readAt: new Date()
        }
      });

      return res.json({
        success: true,
        count: result.count,
        message: `${result.count} notification(s) marked as read`
      });
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read',
        message: error.message
      });
    }
  },

  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      // Verify the notification belongs to the logged-in doctor
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      }

      if (doctorId && notification.doctorId !== doctorId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to delete this notification'
        });
      }

      await prisma.notification.delete({
        where: { id }
      });

      return res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete notification',
        message: error.message
      });
    }
  },

  // Archive notification
  archiveNotification: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      // Verify the notification belongs to the logged-in doctor
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      }

      if (doctorId && notification.doctorId !== doctorId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to archive this notification'
        });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: {
          status: 'archived'
        }
      });

      return res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error('❌ Error archiving notification:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to archive notification',
        message: error.message
      });
    }
  },

  // Get notifications for the logged-in patient
  getPatientNotifications: async (req, res) => {
    try {
      const { status, type, unreadOnly, search } = req.query;
      
      // Get patientId from authenticated user
      let patientId = null;
      if (req.user && req.user.patientId) {
        patientId = req.user.patientId;
      } else if (req.params.patientId) {
        patientId = req.params.patientId;
      }

      if (!patientId) {
        return res.status(400).json({
          success: false,
          error: 'Patient ID is required'
        });
      }

      const where = { patientId };

      // Filter by status
      if (status) {
        where.status = status;
      } else if (unreadOnly === 'true' || unreadOnly === true) {
        where.status = 'unread';
      }

      // Filter by type
      if (type) {
        where.type = type;
      }

      // Search in title and message (SQLite compatible)
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { message: { contains: search } }
        ];
      }

      // Fetch notifications with related data
      const notifications = await prisma.notification.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true
            }
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              specialization: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Fetch appointment data separately for notifications that have appointmentId
      const notificationsWithAppointments = await Promise.all(
        notifications.map(async (notif) => {
          if (notif.appointmentId) {
            try {
              const appointment = await prisma.appointment.findUnique({
                where: { id: notif.appointmentId },
                select: {
                  id: true,
                  date: true,
                  time: true,
                  doctor: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      specialization: true
                    }
                  }
                }
              });
              return { ...notif, appointment };
            } catch (error) {
              console.error(`Error fetching appointment ${notif.appointmentId}:`, error);
              return notif;
            }
          }
          return notif;
        })
      );

      return res.json({
        success: true,
        data: notificationsWithAppointments,
        total: notificationsWithAppointments.length
      });
    } catch (error) {
      console.error('❌ Error fetching patient notifications:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Get unread notification count for patient
  getPatientUnreadCount: async (req, res) => {
    try {
      let patientId = null;
      if (req.user && req.user.patientId) {
        patientId = req.user.patientId;
      } else if (req.params.patientId) {
        patientId = req.params.patientId;
      }

      if (!patientId) {
        return res.status(400).json({
          success: false,
          error: 'Patient ID is required'
        });
      }

      const count = await prisma.notification.count({
        where: {
          patientId,
          status: 'unread'
        }
      });

      return res.json({
        success: true,
        count
      });
    } catch (error) {
      console.error('❌ Error fetching patient unread count:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch unread count',
        message: error.message
      });
    }
  },

  // Mark all notifications as read for patient
  markAllPatientAsRead: async (req, res) => {
    try {
      let patientId = null;
      if (req.user && req.user.patientId) {
        patientId = req.user.patientId;
      } else if (req.params.patientId) {
        patientId = req.params.patientId;
      }

      if (!patientId) {
        return res.status(400).json({
          success: false,
          error: 'Patient ID is required'
        });
      }

      const result = await prisma.notification.updateMany({
        where: {
          patientId,
          status: 'unread'
        },
        data: {
          status: 'read',
          readAt: new Date()
        }
      });

      return res.json({
        success: true,
        count: result.count,
        message: `${result.count} notification(s) marked as read`
      });
    } catch (error) {
      console.error('❌ Error marking all patient notifications as read:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read',
        message: error.message
      });
    }
  }
};

module.exports = notificationController;

