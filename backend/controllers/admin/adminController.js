/**
 * Admin Controller
 * General admin endpoints
 */

const { prisma } = require('../../src/lib/prisma.js');

/**
 * Get all doctors
 */
const getDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        portalUser: {
          select: {
            id: true,
            role: true,
            isActive: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

module.exports = {
  getDoctors
};

