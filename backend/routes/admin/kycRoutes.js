/**
 * Admin KYC Routes
 * KYC document review and management
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getPendingKYC,
  reviewKYC
} = require('../../controllers/admin/kycController');

// All routes require authentication and admin role
router.use(protect);
router.use(requireRole(['admin']));

router.get('/', getPendingKYC);
router.put('/:id/review', reviewKYC);

module.exports = router;

