/**
 * Admin KYC Controller
 * Handle KYC document review and management
 */

const { prisma } = require('../../src/lib/prisma.js');

/**
 * Get all pending KYC documents
 */
const getPendingKYC = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    // Only filter by status if not 'all'
    if (status && status !== 'all') {
      if (status === 'pending') {
        where.status = {
          in: ['pending', 'submitted', 'under_review']
        };
      } else {
        where.status = status;
      }
    }

    const [kycDocs, total] = await Promise.all([
      prisma.kYCDocument.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              kycStatus: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.kYCDocument.count({ where })
    ]);

    res.json({
      success: true,
      data: kycDocs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get pending KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC documents',
      error: error.message
    });
  }
};

/**
 * Review KYC document (approve/reject)
 */
const reviewKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remarks } = req.body; // action: 'approve' or 'reject'
    const reviewerId = req.user?.id || req.user?.employeeId;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    const kycDoc = await prisma.kYCDocument.findUnique({
      where: { id },
      include: { patient: true }
    });

    if (!kycDoc) {
      return res.status(404).json({
        success: false,
        message: 'KYC document not found'
      });
    }

    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      rejectionRemarks: action === 'reject' ? remarks : null
    };

    const updatedKYC = await prisma.kYCDocument.update({
      where: { id },
      data: updateData
    });

    // Update patient KYC status
    await prisma.patient.update({
      where: { id: kycDoc.patientId },
      data: {
        kycStatus: action === 'approve' ? 'approved' : 'rejected'
      }
    });

    res.json({
      success: true,
      message: `KYC document ${action}d successfully`,
      data: updatedKYC
    });
  } catch (error) {
    console.error('Review KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reviewing KYC document',
      error: error.message
    });
  }
};

module.exports = {
  getPendingKYC,
  reviewKYC
};

