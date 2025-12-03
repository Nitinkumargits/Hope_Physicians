import { PrismaClient, Patient, KYCStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Patient Service - CRUD operations for Patient model
 */

export class PatientService {
  /**
   * Create a new patient
   */
  async createPatient(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    insuranceProvider?: string;
    insuranceNumber?: string;
  }): Promise<Patient> {
    // Check if email already exists
    const existing = await prisma.patient.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('Patient with this email already exists');
    }

    return await prisma.patient.create({
      data: {
        ...data,
        kycStatus: 'pending',
      },
    });
  }

  /**
   * Get all patients
   */
  async getAllPatients(filters?: {
    kycStatus?: KYCStatus;
    search?: string;
  }): Promise<Patient[]> {
    const where: any = {};

    if (filters?.kycStatus) {
      where.kycStatus = filters.kycStatus;
    }

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
        { phone: { contains: filters.search } },
      ];
    }

    return await prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<Patient | null> {
    return await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
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
          orderBy: { date: 'desc' },
        },
        kycDocuments: true,
      },
    });
  }

  /**
   * Get patient by email
   */
  async getPatientByEmail(email: string): Promise<Patient | null> {
    return await prisma.patient.findUnique({
      where: { email },
    });
  }

  /**
   * Update patient
   */
  async updatePatient(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      gender: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      emergencyContact: string;
      emergencyPhone: string;
      insuranceProvider: string;
      insuranceNumber: string;
      kycStatus: KYCStatus;
    }>
  ): Promise<Patient> {
    return await prisma.patient.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete patient
   */
  async deletePatient(id: string): Promise<void> {
    await prisma.patient.delete({
      where: { id },
    });
  }
}

export default new PatientService();

