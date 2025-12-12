/**
 * Admin Controller
 * General admin endpoints
 */

const { prisma } = require("../../src/lib/prisma.js");

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
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

/**
 * Get all patients (admin view - returns all patients)
 */
const getAllPatients = async (req, res) => {
  try {
    const { search, kycStatus, page = 1, limit = 100 } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (kycStatus) {
      where.kycStatus = kycStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
          appointments: {
            take: 1,
            orderBy: { date: "desc" },
            include: {
              doctor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  specialization: true,
                },
              },
            },
          },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({
      success: true,
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all patients error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message,
    });
  }
};

/**
 * Get all appointments (admin view - returns all appointments)
 */
const getAllAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 100 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [{ date: "desc" }, { time: "asc" }],
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

module.exports = {
  getDoctors,
  getAllPatients,
  getAllAppointments,
};
