/**
 * Staff Controller - General Staff Operations
 * Handles attendance, tasks, stats, and KYC assistance
 */

const { prisma } = require("../../src/lib/prisma.js");

/**
 * Helper function to resolve employeeId from user context
 * Handles cases where user has staffId but no employeeId
 */
const resolveEmployeeId = async (user) => {
  let employeeId = user?.employeeId;
  const staffId = user?.staffId;

  // If already has employeeId, return it
  if (employeeId) {
    return employeeId;
  }

  // If no employeeId but has staffId, find or create Employee record
  if (staffId) {
    try {
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        include: {
          portalUser: {
            select: {
              employeeId: true,
            },
          },
        },
      });

      if (!staff) {
        throw new Error("Staff record not found");
      }

      // Check if PortalUser already has employeeId
      if (staff.portalUser?.employeeId) {
        employeeId = staff.portalUser.employeeId;
      } else {
        // Try to find existing Employee by empId
        let employee = await prisma.employee.findUnique({
          where: { empId: staff.empId },
        });

        if (!employee) {
          // Create Employee record for Staff member
          employee = await prisma.employee.create({
            data: {
              empId: staff.empId,
              firstName: staff.firstName,
              lastName: staff.lastName,
              email: staff.email,
              phone: staff.phone || null,
              designation: staff.designation || null,
              department: staff.department || null,
              status: "working",
            },
          });
        }

        // Link Employee to PortalUser if user.id exists
        if (user.id && employee.id) {
          try {
            await prisma.portalUser.update({
              where: { id: user.id },
              data: { employeeId: employee.id },
            });
          } catch (updateError) {
            // If update fails, log but continue (employeeId is still valid)
            console.warn(
              "Failed to link employeeId to portalUser:",
              updateError.message
            );
          }
        }

        employeeId = employee.id;
      }
    } catch (error) {
      console.error("Error resolving employeeId:", error);
      throw error;
    }
  }

  return employeeId;
};

/**
 * Get staff dashboard statistics
 */
const getStaffStats = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID not found",
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count completed tasks (assuming tasks are stored somewhere)
    // For now, we'll use a placeholder - you may need to create a Task model
    const tasksCompleted = 0; // TODO: Implement task counting
    const tasksPending = 0; // TODO: Implement task counting

    // Count pending KYC documents that need assistance
    const kycPending = await prisma.kYCDocument.count({
      where: {
        status: {
          in: ["pending", "submitted", "under_review"],
        },
      },
    });

    res.json({
      success: true,
      data: {
        tasksCompleted,
        tasksPending,
        kycPending,
      },
    });
  } catch (error) {
    console.error("Get staff stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching staff statistics",
      error: error.message,
    });
  }
};

/**
 * Get tasks assigned to staff
 */
const getTasks = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;
    const { status, page = 1, limit = 100 } = req.query;

    // TODO: Implement actual task fetching when Task model is created
    // For now, return empty array or mock data
    res.json({
      success: true,
      data: [],
      total: 0,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0,
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

/**
 * Start a task
 */
const startTask = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user?.employeeId || req.user?.id;

    // TODO: Implement task starting when Task model is created
    res.json({
      success: true,
      message: "Task started successfully",
    });
  } catch (error) {
    console.error("Start task error:", error);
    res.status(500).json({
      success: false,
      message: "Error starting task",
      error: error.message,
    });
  }
};

/**
 * Complete a task
 */
const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user?.employeeId || req.user?.id;

    // TODO: Implement task completion when Task model is created
    res.json({
      success: true,
      message: "Task completed successfully",
    });
  } catch (error) {
    console.error("Complete task error:", error);
    res.status(500).json({
      success: false,
      message: "Error completing task",
      error: error.message,
    });
  }
};

/**
 * Check in for attendance
 */
const checkIn = async (req, res) => {
  try {
    const { checkInPhoto, checkInLocation } = req.body;

    // Resolve employeeId (handles staffId -> employeeId conversion)
    let employeeId;
    try {
      employeeId = await resolveEmployeeId(req.user);
    } catch (resolveError) {
      console.error("Error resolving employeeId:", resolveError);
      return res.status(500).json({
        success: false,
        message: "Error setting up employee record",
        error:
          process.env.NODE_ENV === "development"
            ? resolveError.message
            : "Internal server error",
      });
    }

    // Validate employeeId exists
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID not found. Please ensure your account is properly linked to an employee record.",
      });
    }

    // Verify Employee record exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee record not found",
      });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow,
        },
        checkOutTime: null,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
        data: {
          checkInTime: existing.checkInTime.toISOString(),
          existingRecord: existing,
        },
      });
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        staffId: req.user?.staffId || null,
        checkInTime: new Date(),
        checkInPhoto: checkInPhoto || null,
        checkInLocation: checkInLocation || null,
        status: "present",
      },
      include: {
        employee: {
          select: {
            id: true,
            empId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Checked in successfully",
      checkInTime: attendance.checkInTime.toISOString(),
      data: attendance,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });

    // Provide more specific error messages
    let errorMessage = "Error checking in";
    if (error.code === "P2003") {
      errorMessage =
        "Invalid employee reference. Please contact administrator.";
    } else if (error.code === "P2002") {
      errorMessage = "Duplicate attendance record detected.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

/**
 * Check out for attendance
 */
const checkOut = async (req, res) => {
  try {
    const { checkOutPhoto, checkOutLocation } = req.body;

    // Resolve employeeId
    let employeeId;
    try {
      employeeId = await resolveEmployeeId(req.user);
    } catch (resolveError) {
      console.error("Error resolving employeeId:", resolveError);
      return res.status(500).json({
        success: false,
        message: "Error resolving employee record",
        error:
          process.env.NODE_ENV === "development"
            ? resolveError.message
            : "Internal server error",
      });
    }

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID not found. Please ensure your account is properly linked to an employee record.",
      });
    }

    // Find today's check-in
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow,
        },
        checkOutTime: null,
      },
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "No check-in record found for today",
      });
    }

    const checkOutTime = new Date();
    const checkInTime = attendance.checkInTime;
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const workingHours = diffMs / (1000 * 60 * 60); // Convert to hours

    // Determine status based on working hours
    let status = "present";
    if (workingHours < 4) {
      status = "half_day";
    } else if (workingHours < 6) {
      status = "late";
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime,
        checkOutPhoto: checkOutPhoto || null,
        checkOutLocation: checkOutLocation || null,
        workingHours: parseFloat(workingHours.toFixed(2)),
        status,
      },
    });

    res.json({
      success: true,
      message: `Checked out successfully! You worked ${workingHours.toFixed(
        2
      )} hours today.`,
      checkOutTime: updated.checkOutTime.toISOString(),
      hoursWorked: workingHours.toFixed(2),
      data: updated,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking out",
      error: error.message,
    });
  }
};

/**
 * Get attendance status for today
 */
const getAttendanceStatus = async (req, res) => {
  try {
    // Resolve employeeId
    let employeeId;
    try {
      employeeId = await resolveEmployeeId(req.user);
    } catch (resolveError) {
      console.error("Error resolving employeeId:", resolveError);
      return res.status(500).json({
        success: false,
        message: "Error resolving employee record",
        error:
          process.env.NODE_ENV === "development"
            ? resolveError.message
            : "Internal server error",
      });
    }

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID not found",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        checkInTime: "desc",
      },
    });

    res.json({
      success: true,
      checkedIn: !!attendance && !attendance.checkOutTime,
      checkInTime: attendance?.checkInTime?.toISOString() || null,
      checkOutTime: attendance?.checkOutTime?.toISOString() || null,
      workingHours: attendance?.workingHours || null,
    });
  } catch (error) {
    console.error("Get attendance status error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance status",
      error: error.message,
    });
  }
};

/**
 * Get attendance history
 */
const getAttendanceHistory = async (req, res) => {
  try {
    const { page = 1, limit = 30, dateFrom, dateTo } = req.query;

    // Resolve employeeId
    let employeeId;
    try {
      employeeId = await resolveEmployeeId(req.user);
    } catch (resolveError) {
      console.error("Error resolving employeeId:", resolveError);
      return res.status(500).json({
        success: false,
        message: "Error resolving employee record",
        error:
          process.env.NODE_ENV === "development"
            ? resolveError.message
            : "Internal server error",
      });
    }

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID not found",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { employeeId };

    if (dateFrom || dateTo) {
      where.checkInTime = {};
      if (dateFrom) where.checkInTime.gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.checkInTime.lte = endDate;
      }
    }

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { checkInTime: "desc" },
        include: {
          employee: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get attendance history error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance history",
      error: error.message,
    });
  }
};

/**
 * Get KYC documents needing assistance
 */
const getKYCAssistance = async (req, res) => {
  try {
    const { status = "pending", page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      status: {
        in:
          status === "pending"
            ? ["pending", "submitted", "under_review"]
            : [status],
      },
    };

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
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.kYCDocument.count({ where }),
    ]);

    // Format KYC documents for display
    const formattedKYC = kycDocs.map((kyc) => {
      const docCount = [
        kyc.salarySlip1,
        kyc.salarySlip2,
        kyc.salarySlip3,
        kyc.cancelledCheque,
        kyc.passbook,
        kyc.aadhaarFront,
        kyc.aadhaarBack,
        kyc.educationalDoc1,
        kyc.educationalDoc2,
        kyc.educationalDoc3,
      ].filter(Boolean).length;

      return {
        id: kyc.id,
        patient: `${kyc.patient?.firstName || ""} ${
          kyc.patient?.lastName || ""
        }`.trim(),
        patientId: kyc.patientId,
        patientEmail: kyc.patient?.email,
        patientPhone: kyc.patient?.phone,
        submitted: new Date(kyc.createdAt).toLocaleDateString(),
        submittedDate: kyc.createdAt,
        documents: docCount,
        status: kyc.status,
        // Full KYC object
        fullKYC: kyc,
      };
    });

    res.json({
      success: true,
      data: formattedKYC,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get KYC assistance error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching KYC assistance requests",
      error: error.message,
    });
  }
};

/**
 * Assist with KYC document
 */
const assistKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const employeeId = req.user?.employeeId || req.user?.id;

    const kycDoc = await prisma.kYCDocument.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!kycDoc) {
      return res.status(404).json({
        success: false,
        message: "KYC document not found",
      });
    }

    // Update KYC status to under_review if it's pending
    if (kycDoc.status === "pending" || kycDoc.status === "submitted") {
      await prisma.kYCDocument.update({
        where: { id },
        data: {
          status: "under_review",
        },
      });
    }

    res.json({
      success: true,
      message: "KYC assistance provided successfully",
      data: {
        kycId: id,
        assistedBy: employeeId,
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error("Assist KYC error:", error);
    res.status(500).json({
      success: false,
      message: "Error providing KYC assistance",
      error: error.message,
    });
  }
};

module.exports = {
  getStaffStats,
  getTasks,
  startTask,
  completeTask,
  checkIn,
  checkOut,
  getAttendanceStatus,
  getAttendanceHistory,
  getKYCAssistance,
  assistKYC,
};
