/**
 * Patient Chat Controller
 * Handle real-time chat with support
 */

const { prisma } = require('../../src/lib/prisma.js');

/**
 * Get chat messages
 */
const getChatMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user?.patientId;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID not found. Please ensure you are logged in as a patient.',
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      });
    }

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { patientId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.chatMessage.count({ where: { patientId } })
    ]);

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat messages',
      error: error.message,
      data: [],
      pagination: {
        page: parseInt(req.query.page || 1),
        limit: parseInt(req.query.limit || 50),
        total: 0,
        pages: 0
      }
    });
  }
};

/**
 * Send chat message
 */
const sendMessage = async (req, res) => {
  try {
    const { message, messageType = 'text', fileUrl } = req.body;
    const patientId = req.user?.patientId;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID not found. Please ensure you are logged in as a patient.'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        patientId,
        senderId: patientId,
        senderType: 'patient',
        message: message.trim(),
        messageType,
        fileUrl: fileUrl || null
      }
    });

    // TODO: Emit WebSocket event for real-time delivery
    // TODO: Notify support staff

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * Mark messages as read
 */
const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const patientId = req.user.patientId || req.user.id;

    await prisma.chatMessage.updateMany({
      where: {
        id: { in: messageIds },
        patientId,
        senderType: { not: 'patient' } // Only mark staff messages as read
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

/**
 * Get support agents
 */
const getSupportAgents = async (req, res) => {
  try {
    // Get available support staff - try multiple approaches
    let supportStaff = [];
    
    try {
      // First, try to get staff with support designation and active portal user
      supportStaff = await prisma.staff.findMany({
        where: {
          OR: [
            { designation: { contains: 'support', mode: 'insensitive' } },
            { designation: { contains: 'customer', mode: 'insensitive' } },
            { designation: { contains: 'service', mode: 'insensitive' } },
            { department: { contains: 'support', mode: 'insensitive' } }
          ],
          portalUser: {
            isActive: true,
            canAccessSystem: true
          }
        },
        include: {
          portalUser: {
            select: {
              id: true,
              isActive: true,
              canAccessSystem: true
            }
          }
        },
        take: 10
      });
    } catch (relationError) {
      console.warn('Error with portalUser relation, trying alternative query:', relationError.message);
      
      // Fallback: Get staff with support designation regardless of portal user
      supportStaff = await prisma.staff.findMany({
        where: {
          OR: [
            { designation: { contains: 'support', mode: 'insensitive' } },
            { designation: { contains: 'customer', mode: 'insensitive' } },
            { designation: { contains: 'service', mode: 'insensitive' } },
            { department: { contains: 'support', mode: 'insensitive' } }
          ]
        },
        take: 10
      });
    }
    
    // If no support staff found, get any active staff members
    if (supportStaff.length === 0) {
      try {
        supportStaff = await prisma.staff.findMany({
          where: {
            portalUser: {
              isActive: true,
              canAccessSystem: true
            }
          },
          take: 5
        });
      } catch (fallbackError) {
        console.warn('Fallback query failed, getting any staff:', fallbackError.message);
        supportStaff = await prisma.staff.findMany({
          take: 5
        });
      }
    }

    // Format response
    const formattedStaff = supportStaff.map(staff => ({
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      name: `${staff.firstName} ${staff.lastName}`,
      designation: staff.designation || 'Support Staff',
      department: staff.department || 'Support'
    }));

    res.json({
      success: true,
      data: formattedStaff
    });
  } catch (error) {
    console.error('Get support agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching support agents',
      error: error.message
    });
  }
};

module.exports = {
  getChatMessages,
  sendMessage,
  markAsRead,
  getSupportAgents
};

