// controllers/contactController.js
const { prisma } = require("../src/lib/prisma.js");

const contactController = {
  // Submit contact form (public endpoint)
  submitContactForm: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, subject, message } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: firstName, lastName, email, subject, and message are required",
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
      }

      // Create contact message
      const contactMessage = await prisma.contactMessage.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          phone: phone || null,
          subject,
          message,
          status: "new",
        },
      });

      console.log(`✅ Contact form submitted: ${contactMessage.id} from ${email}`);

      return res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        data: {
          id: contactMessage.id,
          firstName: contactMessage.firstName,
          lastName: contactMessage.lastName,
          email: contactMessage.email,
          subject: contactMessage.subject,
          createdAt: contactMessage.createdAt,
        },
      });
    } catch (error) {
      console.error("❌ Error submitting contact form:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to submit contact form",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get all contact messages with filters and pagination
  getContactMessages: async (req, res) => {
    try {
      const {
        status,
        search,
        startDate,
        endDate,
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where = {};

      // Status filter
      if (status && status !== "all") {
        where.status = status;
      }

      // Date range filter
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
          where.createdAt.lte = new Date(endDate);
        }
      }

      // Search filter (name, email, subject)
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get total count for pagination
      const total = await prisma.contactMessage.count({ where });

      // Get messages
      const messages = await prisma.contactMessage.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      // Get statistics
      const stats = {
        total: await prisma.contactMessage.count(),
        new: await prisma.contactMessage.count({ where: { status: "new" } }),
        read: await prisma.contactMessage.count({ where: { status: "read" } }),
        replied: await prisma.contactMessage.count({ where: { status: "replied" } }),
        archived: await prisma.contactMessage.count({ where: { status: "archived" } }),
      };

      return res.status(200).json({
        success: true,
        data: messages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
        stats,
      });
    } catch (error) {
      console.error("❌ Error fetching contact messages:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch contact messages",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get single contact message by ID
  getContactMessageById: async (req, res) => {
    try {
      const { id } = req.params;

      const message = await prisma.contactMessage.findUnique({
        where: { id },
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          error: "Contact message not found",
        });
      }

      // Auto-mark as read if status is "new"
      if (message.status === "new") {
        await prisma.contactMessage.update({
          where: { id },
          data: {
            status: "read",
            readAt: new Date(),
          },
        });
        message.status = "read";
        message.readAt = new Date();
      }

      return res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error("❌ Error fetching contact message:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch contact message",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Update message status
  updateMessageStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["new", "read", "replied", "archived"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const updateData = { status };

      // Set readAt when marking as read
      if (status === "read") {
        updateData.readAt = new Date();
      }

      // Set repliedAt when marking as replied
      if (status === "replied") {
        updateData.repliedAt = new Date();
        // Also set readAt if not already set
        const message = await prisma.contactMessage.findUnique({
          where: { id },
          select: { readAt: true },
        });
        if (!message.readAt) {
          updateData.readAt = new Date();
        }
      }

      const updatedMessage = await prisma.contactMessage.update({
        where: { id },
        data: updateData,
      });

      console.log(`✅ Contact message ${id} status updated to ${status}`);

      return res.status(200).json({
        success: true,
        message: "Message status updated successfully",
        data: updatedMessage,
      });
    } catch (error) {
      console.error("❌ Error updating message status:", error);
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Contact message not found",
        });
      }
      return res.status(500).json({
        success: false,
        error: "Failed to update message status",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Delete contact message (admin only)
  deleteContactMessage: async (req, res) => {
    try {
      const { id } = req.params;

      const message = await prisma.contactMessage.findUnique({
        where: { id },
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          error: "Contact message not found",
        });
      }

      await prisma.contactMessage.delete({
        where: { id },
      });

      console.log(`✅ Contact message ${id} deleted by admin`);

      return res.status(200).json({
        success: true,
        message: "Contact message deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting contact message:", error);
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Contact message not found",
        });
      }
      return res.status(500).json({
        success: false,
        error: "Failed to delete contact message",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = contactController;

