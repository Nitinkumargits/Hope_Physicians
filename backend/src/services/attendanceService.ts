import { PrismaClient, Attendance, AttendanceStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Attendance Service - CRUD operations for Attendance model
 * Handles check-in/check-out with photo and location
 * Computes working hours only after check-out
 */

export class AttendanceService {
  /**
   * Check in an employee/staff
   */
  async checkIn(data: {
    employeeId: string;
    staffId?: string;
    checkInPhoto?: string;
    checkInLocation?: string;
  }): Promise<Attendance> {
    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId: data.employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow,
        },
        checkOutTime: null,
      },
    });

    if (existing) {
      throw new Error('Employee is already checked in today');
    }

    return await prisma.attendance.create({
      data: {
        employeeId: data.employeeId,
        staffId: data.staffId,
        checkInTime: new Date(),
        checkInPhoto: data.checkInPhoto,
        checkInLocation: data.checkInLocation,
        status: 'present',
      },
    });
  }

  /**
   * Check out an employee/staff
   */
  async checkOut(data: {
    employeeId: string;
    staffId?: string;
    checkOutPhoto?: string;
    checkOutLocation?: string;
  }): Promise<Attendance> {
    // Find today's check-in record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: data.employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow,
        },
        checkOutTime: null,
      },
    });

    if (!attendance) {
      throw new Error('No check-in record found for today');
    }

    const checkOutTime = new Date();
    const checkInTime = attendance.checkInTime;

    // Calculate working hours
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const workingHours = diffMs / (1000 * 60 * 60); // Convert to hours

    return await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime,
        checkOutPhoto: data.checkOutPhoto,
        checkOutLocation: data.checkOutLocation,
        workingHours: parseFloat(workingHours.toFixed(2)),
        status: this.determineStatus(workingHours),
      },
    });
  }

  /**
   * Get attendance status for today
   */
  async getTodayAttendanceStatus(employeeId: string): Promise<{
    checkedIn: boolean;
    checkInTime: Date | null;
    checkOutTime: Date | null;
    workingHours: number | null;
  }> {
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
      orderBy: { checkInTime: 'desc' },
    });

    if (!attendance) {
      return {
        checkedIn: false,
        checkInTime: null,
        checkOutTime: null,
        workingHours: null,
      };
    }

    return {
      checkedIn: attendance.checkOutTime === null,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      workingHours: attendance.workingHours,
    };
  }

  /**
   * Get attendance history for an employee
   */
  async getAttendanceHistory(
    employeeId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Attendance[]> {
    const where: any = { employeeId };

    if (startDate || endDate) {
      where.checkInTime = {};
      if (startDate) {
        where.checkInTime.gte = startDate;
      }
      if (endDate) {
        where.checkInTime.lte = endDate;
      }
    }

    return await prisma.attendance.findMany({
      where,
      orderBy: { checkInTime: 'desc' },
    });
  }

  /**
   * Get all attendance records for a date range
   */
  async getAllAttendance(startDate: Date, endDate: Date): Promise<Attendance[]> {
    return await prisma.attendance.findMany({
      where: {
        checkInTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            empId: true,
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
      orderBy: { checkInTime: 'desc' },
    });
  }

  /**
   * Determine attendance status based on working hours
   */
  private determineStatus(workingHours: number): AttendanceStatus {
    if (workingHours >= 8) {
      return 'present';
    } else if (workingHours >= 4) {
      return 'half_day';
    } else {
      return 'late';
    }
  }
}

export default new AttendanceService();

