/**
 * Admin Routes
 * General admin endpoints
 */

const express = require("express");
const router = express.Router();
const { protect } = require("../../middlewares/authMiddleware");
const { requireRole } = require("../../middlewares/roleMiddleware");
const {
  getDoctors,
  getAllPatients,
  getAllAppointments,
} = require("../../controllers/admin/adminController");
const {
  getEmployees,
  getAdminStats,
  getAttendance,
} = require("../../controllers/admin/staffManagementController");

// All routes require authentication and admin role
router.use(protect);
router.use(requireRole(["admin"]));

// Doctor routes
router.get("/doctors", getDoctors);

// Employee routes
router.get("/employees", getEmployees);

// Statistics routes
router.get("/stats", getAdminStats);

// Attendance routes
router.get("/attendance", getAttendance);

// Patient routes
router.get("/patients", getAllPatients);

// Appointment routes
router.get("/appointments", getAllAppointments);

module.exports = router;
