// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

// All routes require authentication
router.use(protect);

// Get notifications for logged-in doctor
router.get('/doctor', notificationController.getDoctorNotifications);

// Get notifications for specific doctor (by ID)
router.get('/doctor/:doctorId', notificationController.getDoctorNotifications);

// Get unread count for logged-in doctor
router.get('/doctor/unread/count', notificationController.getUnreadCount);

// Get unread count for specific doctor
router.get('/doctor/:doctorId/unread/count', notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read for logged-in doctor
router.patch('/doctor/mark-all-read', notificationController.markAllAsRead);

// Mark all notifications as read for specific doctor
router.patch('/doctor/:doctorId/mark-all-read', notificationController.markAllAsRead);

// Archive notification
router.patch('/:id/archive', notificationController.archiveNotification);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Patient notification routes
// Get notifications for logged-in patient
router.get('/patient', notificationController.getPatientNotifications);

// Get notifications for specific patient (by ID)
router.get('/patient/:patientId', notificationController.getPatientNotifications);

// Get unread count for logged-in patient
router.get('/patient/unread/count', notificationController.getPatientUnreadCount);

// Get unread count for specific patient
router.get('/patient/:patientId/unread/count', notificationController.getPatientUnreadCount);

// Mark all notifications as read for logged-in patient
router.patch('/patient/mark-all-read', notificationController.markAllPatientAsRead);

// Mark all notifications as read for specific patient
router.patch('/patient/:patientId/mark-all-read', notificationController.markAllPatientAsRead);

module.exports = router;

