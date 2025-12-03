import { PrismaClient, Doctor } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Doctor Service - CRUD operations for Doctor model
 */

export class DoctorService {
  /**
   * Create a new doctor
   */
  async createDoctor(data: {
    empId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    specialization: string;
    licenseNumber?: string;
    yearsOfExperience?: number;
    bio?: string;
    profileImage?: string;
  }): Promise<Doctor> {
    // Check if empId or email already exists
    const existingEmp = await prisma.doctor.findUnique({
      where: { empId: data.empId },
    });

    if (existingEmp) {
      throw new Error(`Doctor with Employee ID ${data.empId} already exists`);
    }

    const existingEmail = await prisma.doctor.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error('Doctor with this email already exists');
    }

    return await prisma.doctor.create({
      data: {
        ...data,
        isAvailable: true,
      },
    });
  }

  /**
   * Get all doctors
   */
  async getAllDoctors(filters?: {
    specialization?: string;
    isAvailable?: boolean;
    search?: string;
  }): Promise<Doctor[]> {
    const where: any = {};

    if (filters?.specialization) {
      where.specialization = filters.specialization;
    }
    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
        { specialization: { contains: filters.search } },
      ];
    }

    return await prisma.doctor.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get doctor by ID
   */
  async getDoctorById(id: string): Promise<Doctor | null> {
    return await prisma.doctor.findUnique({
      where: { id },
      include: {
        appointments: {
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
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  /**
   * Get doctor by Employee ID
   */
  async getDoctorByEmpId(empId: string): Promise<Doctor | null> {
    return await prisma.doctor.findUnique({
      where: { empId },
    });
  }

  /**
   * Update doctor
   */
  async updateDoctor(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      specialization: string;
      licenseNumber: string;
      yearsOfExperience: number;
      bio: string;
      profileImage: string;
      isAvailable: boolean;
    }>
  ): Promise<Doctor> {
    return await prisma.doctor.update({
      where: { id },
      data,
    });
  }

  /**
   * Set doctor availability
   */
  async setAvailability(id: string, isAvailable: boolean): Promise<Doctor> {
    return await prisma.doctor.update({
      where: { id },
      data: { isAvailable },
    });
  }

  /**
   * Delete doctor
   */
  async deleteDoctor(id: string): Promise<void> {
    await prisma.doctor.delete({
      where: { id },
    });
  }
}

export default new DoctorService();

