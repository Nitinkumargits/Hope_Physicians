// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../src/lib/prisma.js");
require("dotenv").config();

const authController = {
  // Login endpoint
  login: async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Find user by email
      const portalUser = await prisma.portalUser.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          employee: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
              email: true,
              isActive: true,
            },
          },
          doctor: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          staff: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!portalUser) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check if user is active
      if (!portalUser.isActive || !portalUser.canAccessSystem) {
        return res.status(403).json({
          error: "Account is inactive. Please contact administrator.",
        });
      }

      // Check role if specified
      if (role && portalUser.role.toLowerCase() !== role.toLowerCase()) {
        return res.status(403).json({
          error: `Access denied. This account is for ${portalUser.role} role, but you selected ${role}.`,
        });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, portalUser.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Prepare user data for response
      const userData = {
        id: portalUser.id,
        email: portalUser.email,
        role: portalUser.role,
        is_active: portalUser.isActive,
        can_access_system: portalUser.canAccessSystem,
      };

      // Add role-specific IDs
      if (portalUser.role === "doctor" || portalUser.doctorId) {
        // ALWAYS use Dr. Okonkwo Doctor's ID for any doctor login
        let okonkwoDoctor = await prisma.doctor.findUnique({
          where: { email: "doctor@hopephysicians.com" },
        });

        if (!okonkwoDoctor) {
          okonkwoDoctor = await prisma.doctor.findFirst({
            where: {
              firstName: "Okonkwo",
              lastName: "Doctor",
            },
          });
        }

        if (!okonkwoDoctor) {
          okonkwoDoctor = await prisma.doctor.findFirst();
        }

        // Always assign Dr. Okonkwo Doctor's ID
        userData.doctorId = okonkwoDoctor?.id || portalUser.doctorId;
        userData.name = `Dr. ${
          okonkwoDoctor?.firstName || portalUser.doctor?.firstName || "Doctor"
        } ${okonkwoDoctor?.lastName || portalUser.doctor?.lastName || ""}`;
        userData.specialization =
          okonkwoDoctor?.specialization ||
          portalUser.doctor?.specialization ||
          "General";
        console.log(
          `✅ Login: Assigned Dr. Okonkwo Doctor ID (${userData.doctorId}) to user ${portalUser.email}`
        );
      } else if (portalUser.patientId) {
        userData.patientId = portalUser.patientId;
        userData.name = `${portalUser.patient.firstName} ${portalUser.patient.lastName}`;
      } else if (portalUser.staffId) {
        userData.staffId = portalUser.staffId;
        userData.name = `${portalUser.staff.firstName} ${portalUser.staff.lastName}`;
      } else if (portalUser.employeeId) {
        userData.employeeId = portalUser.employeeId;
        userData.name = `${portalUser.employee.firstName} ${portalUser.employee.lastName}`;
      }

      // Prepare token payload with role-specific IDs
      const tokenPayload = {
        id: portalUser.id,
        email: portalUser.email,
        role: portalUser.role,
      };

      // Add role-specific IDs to token
      if (portalUser.role === "doctor" || portalUser.doctorId) {
        tokenPayload.doctorId = userData.doctorId;
      } else if (portalUser.patientId) {
        tokenPayload.patientId = portalUser.patientId;
      } else if (portalUser.staffId) {
        tokenPayload.staffId = portalUser.staffId;
      } else if (portalUser.employeeId) {
        tokenPayload.employeeId = portalUser.employeeId;
      }

      // Generate JWT token
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || "your-secret-key-change-in-production",
        { expiresIn: "8h" }
      );

      return res.json({
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get current user endpoint
  getCurrentUser: async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
      }

      // Token format: "Bearer <token>"
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key-change-in-production"
        );
      } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Find user by ID from token
      const portalUser = await prisma.portalUser.findUnique({
        where: { id: decoded.id },
        include: {
          employee: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
              email: true,
              isActive: true,
            },
          },
          doctor: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          staff: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!portalUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user is still active
      if (!portalUser.isActive || !portalUser.canAccessSystem) {
        return res.status(403).json({ error: "Account is inactive" });
      }

      // Prepare user data for response
      const userData = {
        id: portalUser.id,
        email: portalUser.email,
        role: portalUser.role,
        is_active: portalUser.isActive,
        can_access_system: portalUser.canAccessSystem,
      };

      // Add role-specific IDs
      if (portalUser.role === "doctor" || portalUser.doctorId) {
        // ALWAYS use Dr. Okonkwo Doctor's ID for any doctor login
        let okonkwoDoctor = await prisma.doctor.findUnique({
          where: { email: "doctor@hopephysicians.com" },
        });

        if (!okonkwoDoctor) {
          okonkwoDoctor = await prisma.doctor.findFirst({
            where: {
              firstName: "Okonkwo",
              lastName: "Doctor",
            },
          });
        }

        if (!okonkwoDoctor) {
          okonkwoDoctor = await prisma.doctor.findFirst();
        }

        // Always assign Dr. Okonkwo Doctor's ID
        userData.doctorId = okonkwoDoctor?.id || portalUser.doctorId;
        userData.name = `Dr. ${
          okonkwoDoctor?.firstName || portalUser.doctor?.firstName || "Doctor"
        } ${okonkwoDoctor?.lastName || portalUser.doctor?.lastName || ""}`;
        userData.specialization =
          okonkwoDoctor?.specialization ||
          portalUser.doctor?.specialization ||
          "General";
        console.log(
          `✅ GetCurrentUser: Assigned Dr. Okonkwo Doctor ID (${userData.doctorId}) to user ${portalUser.email}`
        );
      } else if (portalUser.patientId) {
        userData.patientId = portalUser.patientId;
        userData.name = `${portalUser.patient.firstName} ${portalUser.patient.lastName}`;
      } else if (portalUser.staffId) {
        userData.staffId = portalUser.staffId;
        userData.name = `${portalUser.staff.firstName} ${portalUser.staff.lastName}`;
      } else if (portalUser.employeeId) {
        userData.employeeId = portalUser.employeeId;
        userData.name = `${portalUser.employee.firstName} ${portalUser.employee.lastName}`;
      }

      return res.json(userData);
    } catch (error) {
      console.error("Get current user error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = authController;
