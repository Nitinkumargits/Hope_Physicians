import { PrismaClient, Appointment, AppointmentStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Appointment Service - CRUD operations for Appointment model
 */

export class AppointmentService {
  /**
   * Create a new appointment
   */
  async createAppointment(data: {
    patientId: string;
    doctorId: string;
    date: Date;
    time: string;
    type?: string;
    notes?: string;
    department?: string;
  }): Promise<Appointment> {
    return await prisma.appointment.create({
      data: {
        ...data,
        status: 'scheduled',
      },
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
    });
  }

  /**
   * Get all appointments
   */
  async getAllAppointments(filters?: {
    patientId?: string;
    doctorId?: string;
    status?: AppointmentStatus;
    date?: Date;
  }): Promise<Appointment[]> {
    const where: any = {};

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters?.doctorId) {
      where.doctorId = filters.doctorId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return await prisma.appointment.findMany({
      where,
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
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id: string): Promise<Appointment | null> {
    return await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  /**
   * Update appointment
   */
  async updateAppointment(
    id: string,
    data: Partial<{
      date: Date;
      time: string;
      type: string;
      status: AppointmentStatus;
      notes: string;
      department: string;
    }>
  ): Promise<Appointment> {
    return await prisma.appointment.update({
      where: { id },
      data,
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
    });
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(id: string): Promise<Appointment> {
    return await prisma.appointment.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }

  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(
    id: string,
    newDate: Date,
    newTime: string
  ): Promise<Appointment> {
    return await prisma.appointment.update({
      where: { id },
      data: {
        date: newDate,
        time: newTime,
        status: 'rescheduled',
      },
    });
  }

  /**
   * Accept appointment (for doctors)
   */
  async acceptAppointment(id: string): Promise<Appointment> {
    return await prisma.appointment.update({
      where: { id },
      data: {
        status: 'confirmed',
      },
    });
  }

  /**
   * Get today's appointments for a doctor
   */
  async getTodayAppointments(doctorId: string): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          not: 'cancelled',
        },
      },
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
      orderBy: { time: 'asc' },
    });
  }
}

export default new AppointmentService();

