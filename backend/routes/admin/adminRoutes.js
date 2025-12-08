/**
 * Admin Routes
 * General admin endpoints
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getDoctors
} = require('../../controllers/admin/adminController');

// All routes require authentication and admin role
router.use(protect);
router.use(requireRole(['admin']));

router.get('/doctors', getDoctors);

module.exports = router;

