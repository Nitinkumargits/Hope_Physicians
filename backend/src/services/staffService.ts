import { PrismaClient, Staff } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Staff Service - CRUD operations for Staff model
 */

export class StaffService {
  /**
   * Create a new staff member
   */
  async createStaff(data: {
    empId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    designation?: string;
    department?: string;
  }): Promise<Staff> {
    // Check if empId or email already exists
    const existingEmp = await prisma.staff.findUnique({
      where: { empId: data.empId },
    });

    if (existingEmp) {
      throw new Error(`Staff with Employee ID ${data.empId} already exists`);
    }

    const existingEmail = await prisma.staff.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error('Staff with this email already exists');
    }

    return await prisma.staff.create({
      data,
    });
  }

  /**
   * Get all staff
   */
  async getAllStaff(filters?: {
    department?: string;
    search?: string;
  }): Promise<Staff[]> {
    const where: any = {};

    if (filters?.department) {
      where.department = filters.department;
    }
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
        { empId: { contains: filters.search } },
      ];
    }

    return await prisma.staff.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get staff by ID
   */
  async getStaffById(id: string): Promise<Staff | null> {
    return await prisma.staff.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        attendance: {
          orderBy: { checkInTime: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Get staff by Employee ID
   */
  async getStaffByEmpId(empId: string): Promise<Staff | null> {
    return await prisma.staff.findUnique({
      where: { empId },
    });
  }

  /**
   * Update staff
   */
  async updateStaff(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      designation: string;
      department: string;
    }>
  ): Promise<Staff> {
    return await prisma.staff.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete staff
   */
  async deleteStaff(id: string): Promise<void> {
    await prisma.staff.delete({
      where: { id },
    });
  }
}

export default new StaffService();

