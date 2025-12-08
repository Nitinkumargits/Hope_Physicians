/**
 * Admin Controller - Staff Management
 * Handles staff CRUD, roles, permissions, attendance, and inventory
 */

const { prisma } = require('../../src/lib/prisma.js');
const bcrypt = require('bcryptjs');

/**
 * Get all staff members
 */
const getStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department,
      designation
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { empId: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (department) where.department = department;
    if (designation) where.designation = designation;

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          portalUser: {
            select: {
              id: true,
              role: true,
              isActive: true,
              canAccessSystem: true
            }
          }
        }
      }),
      prisma.staff.count({ where })
    ]);

    res.json({
      success: true,
      data: staff,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff',
      error: error.message
    });
  }
};

/**
 * Get all employees (including doctors)
 */
const getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department,
      status
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { empId: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (department) where.department = department;
    if (status) where.status = status;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          portalUser: {
            select: {
              id: true,
              role: true,
              isActive: true
            }
          }
        }
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
};

/**
 * Add new staff member
 */
const addStaff = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      designation,
      department,
      password,
      role = 'staff'
    } = req.body;

    // Check if email already exists
    const existingUser = await prisma.portalUser.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate employee ID
    const lastStaff = await prisma.staff.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let empId = 'STF1001';
    if (lastStaff && lastStaff.empId) {
      const lastNum = parseInt(lastStaff.empId.replace('STF', ''));
      empId = `STF${lastNum + 1}`;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password || 'password123', 10);

    // Create staff and portal user
    const staff = await prisma.staff.create({
      data: {
        empId,
        firstName,
        lastName,
        email,
        phone,
        designation,
        department,
        portalUser: {
          create: {
            email,
            passwordHash,
            role
          }
        }
      },
      include: {
        portalUser: {
          select: {
            id: true,
            role: true,
            isActive: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      data: staff
    });
  } catch (error) {
    console.error('Add staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding staff member',
      error: error.message
    });
  }
};

/**
 * Update staff member
 */
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove password from update data if present (handle separately)
    const { password, ...staffData } = updateData;

    const staff = await prisma.staff.update({
      where: { id },
      data: staffData,
      include: {
        portalUser: {
          select: {
            id: true,
            role: true,
            isActive: true
          }
        }
      }
    });

    // Update password if provided
    if (password && staff.portalUser) {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.portalUser.update({
        where: { id: staff.portalUser.id },
        data: { passwordHash }
      });
    }

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff
    });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating staff member',
      error: error.message
    });
  }
};

/**
 * Delete staff member (soft delete)
 */
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id },
      include: { portalUser: true }
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Deactivate portal user
    if (staff.portalUser) {
      await prisma.portalUser.update({
        where: { id: staff.portalUser.id },
        data: {
          isActive: false,
          canAccessSystem: false
        }
      });
    }

    res.json({
      success: true,
      message: 'Staff member deactivated successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting staff member',
      error: error.message
    });
  }
};

/**
 * Get role permissions
 */
const getRolePermissions = async (req, res) => {
  try {
    const roles = await prisma.rolePermission.findMany({
      orderBy: { role: 'asc' }
    });

    const rolesWithParsedPermissions = roles.map(role => ({
      ...role,
      permissions: JSON.parse(role.permissions)
    }));

    res.json({
      success: true,
      data: rolesWithParsedPermissions
    });
  } catch (error) {
    console.error('Get role permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching role permissions',
      error: error.message
    });
  }
};

/**
 * Update role permissions
 */
const updateRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;
    const { permissions, description } = req.body;

    const rolePermission = await prisma.rolePermission.upsert({
      where: { role },
      update: {
        permissions: JSON.stringify(permissions),
        description
      },
      create: {
        role,
        permissions: JSON.stringify(permissions),
        description
      }
    });

    res.json({
      success: true,
      message: 'Role permissions updated successfully',
      data: {
        ...rolePermission,
        permissions: JSON.parse(rolePermission.permissions)
      }
    });
  } catch (error) {
    console.error('Update role permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating role permissions',
      error: error.message
    });
  }
};

/**
 * Get attendance records
 */
const getAttendance = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      employeeId,
      dateFrom,
      dateTo,
      status
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.checkInTime = {};
      if (dateFrom) where.checkInTime.gte = new Date(dateFrom);
      if (dateTo) where.checkInTime.lte = new Date(dateTo);
    }

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { checkInTime: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
              designation: true,
              department: true
            }
          }
        }
      }),
      prisma.attendance.count({ where })
    ]);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

/**
 * Get inventory/asset management
 */
const getInventory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      status,
      location
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { itemName: { contains: search, mode: 'insensitive' } },
        { itemCode: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;
    if (location) where.location = location;

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.inventory.count({ where })
    ]);

    res.json({
      success: true,
      data: inventory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory',
      error: error.message
    });
  }
};

/**
 * Add inventory item
 */
const addInventoryItem = async (req, res) => {
  try {
    const {
      itemName,
      itemCode,
      category,
      description,
      manufacturer,
      modelNumber,
      serialNumber,
      quantity = 1,
      unit = 'unit',
      location,
      status = 'available',
      condition,
      purchaseDate,
      purchasePrice,
      warrantyExpiry
    } = req.body;

    const inventory = await prisma.inventory.create({
      data: {
        itemName,
        itemCode,
        category,
        description,
        manufacturer,
        modelNumber,
        serialNumber,
        quantity,
        unit,
        location,
        status,
        condition,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchasePrice,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      data: inventory
    });
  } catch (error) {
    console.error('Add inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding inventory item',
      error: error.message
    });
  }
};

/**
 * Update inventory item
 */
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.purchaseDate) {
      updateData.purchaseDate = new Date(updateData.purchaseDate);
    }
    if (updateData.warrantyExpiry) {
      updateData.warrantyExpiry = new Date(updateData.warrantyExpiry);
    }
    if (updateData.lastMaintenanceDate) {
      updateData.lastMaintenanceDate = new Date(updateData.lastMaintenanceDate);
    }
    if (updateData.nextMaintenanceDate) {
      updateData.nextMaintenanceDate = new Date(updateData.nextMaintenanceDate);
    }

    const inventory = await prisma.inventory.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: inventory
    });
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inventory item',
      error: error.message
    });
  }
};

/**
 * Get admin dashboard statistics
 */
const getAdminStats = async (req, res) => {
  try {
    const [
      totalStaff,
      totalEmployees,
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      totalBilling,
      paidBilling,
      totalInventory
    ] = await Promise.all([
      prisma.staff.count({ where: { portalUser: { isActive: true } } }),
      prisma.employee.count({ where: { isActive: true } }),
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.billing.aggregate({ _sum: { totalAmount: true } }),
      prisma.billing.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { paidAmount: true }
      }),
      prisma.inventory.count()
    ]);

    // Count pending KYC
    const pendingKYC = await prisma.kYCDocument.count({
      where: {
        status: {
          in: ['pending', 'submitted', 'under_review']
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalStaff,
        totalEmployees,
        totalPatients,
        totalDoctors,
        totalAppointments,
        appointmentsToday: todayAppointments,
        pendingKYC,
        totalRevenue: totalBilling._sum.totalAmount || 0,
        paidRevenue: paidBilling._sum.paidAmount || 0,
        totalInventory
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
};

module.exports = {
  getStaff,
  getEmployees,
  addStaff,
  updateStaff,
  deleteStaff,
  getRolePermissions,
  updateRolePermissions,
  getAttendance,
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  getAdminStats
};

