import { PrismaClient, PortalUser, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcryptjs';

/**
 * Portal User Service - CRUD operations for PortalUser model
 * Handles authentication and user management
 */

export class PortalUserService {
  /**
   * Create a new portal user
   */
  async createUser(data: {
    email: string;
    password: string;
    role: UserRole;
    employeeId?: string;
    doctorId?: string;
    patientId?: string;
    staffId?: string;
  }): Promise<PortalUser> {
    // Check if email already exists
    const existing = await prisma.portalUser.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    return await prisma.portalUser.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        employeeId: data.employeeId,
        doctorId: data.doctorId,
        patientId: data.patientId,
        staffId: data.staffId,
        isActive: true,
        canAccessSystem: true,
      },
    });
  }

  /**
   * Authenticate user (login)
   */
  async authenticate(email: string, password: string): Promise<PortalUser | null> {
    const user = await prisma.portalUser.findUnique({
      where: { email },
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

    if (!user) {
      return null;
    }

    // Check if user is active
    if (!user.isActive || !user.canAccessSystem) {
      throw new Error('Account is inactive. Please contact administrator.');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<PortalUser | null> {
    return await prisma.portalUser.findUnique({
      where: { email },
      include: {
        employee: true,
        doctor: true,
        patient: true,
        staff: true,
      },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<PortalUser | null> {
    return await prisma.portalUser.findUnique({
      where: { id },
      include: {
        employee: true,
        doctor: true,
        patient: true,
        staff: true,
      },
    });
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, newPassword: string): Promise<PortalUser> {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    return await prisma.portalUser.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<PortalUser> {
    return await prisma.portalUser.update({
      where: { id: userId },
      data: {
        isActive: false,
        canAccessSystem: false,
      },
    });
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<PortalUser> {
    return await prisma.portalUser.update({
      where: { id: userId },
      data: {
        isActive: true,
        canAccessSystem: true,
      },
    });
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<PortalUser[]> {
    return await prisma.portalUser.findMany({
      where: {
        role,
        isActive: true,
      },
      include: {
        employee: true,
        doctor: true,
        patient: true,
        staff: true,
      },
    });
  }
}

export default new PortalUserService();

