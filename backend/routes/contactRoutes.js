// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { protect } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

// Public route - anyone can submit contact form
router.post("/", contactController.submitContactForm);

// Protected routes - admin and doctor only
router.use(protect);
router.use(requireRole(["admin", "doctor"]));

// Get all contact messages with filters
router.get("/messages", contactController.getContactMessages);

// Get single message by ID
router.get("/messages/:id", contactController.getContactMessageById);

// Update message status
router.patch("/messages/:id/status", contactController.updateMessageStatus);

// Delete message (admin only)
router.delete("/messages/:id", requireRole(["admin"]), contactController.deleteContactMessage);

module.exports = router;

