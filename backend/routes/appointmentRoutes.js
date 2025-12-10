
// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware'); // Optional: protect admin-only routes

// Public route: submit new appointment
router.post('/', appointmentController.createAppointment);

// Protected route: get all appointments (admin only)
router.get('/', authMiddleware.verifyToken, appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', authMiddleware.authenticate, appointmentController.getAppointmentById);

module.exports = router;
