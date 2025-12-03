import { PrismaClient, CalendarEvent, EventStatus, EventType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NotificationService } from './notificationService';

/**
 * Calendar Event Service - CRUD operations for CalendarEvent model
 * Automatically creates notifications when events are created
 */

export class CalendarEventService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Create a new calendar event
   * If assignedToAll is true, creates notifications for all employees
   * Otherwise, creates assignments and notifications for specific employees/doctors/staff
   */
  async createEvent(data: {
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    eventType: EventType;
    assignedToAll: boolean;
    createdBy: string;
    assignedEmployeeIds?: string[];
    assignedDoctorIds?: string[];
    assignedStaffIds?: string[];
  }): Promise<CalendarEvent> {
    const event = await prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        eventType: data.eventType,
        status: 'upcoming',
        assignedToAll: data.assignedToAll,
        createdBy: data.createdBy,
        assignments: data.assignedToAll
          ? undefined
          : {
              create: [
                ...(data.assignedEmployeeIds || []).map((empId) => ({
                  employeeId: empId,
                })),
                ...(data.assignedDoctorIds || []).map((docId) => ({
                  doctorId: docId,
                })),
                ...(data.assignedStaffIds || []).map((staffId) => ({
                  staffId: staffId,
                })),
              ],
            },
      },
    });

    // Create notification for the event
    if (data.assignedToAll) {
      await this.notificationService.createNotification({
        title: `New Calendar Event: ${data.title}`,
        message: data.description || `Event scheduled for ${data.startDate.toLocaleDateString()}`,
        type: 'event',
        priority: 'medium',
        allEmployees: true,
        eventId: event.id,
      });
    } else {
      // Create notifications for assigned employees
      const assignments = await prisma.calendarEventAssignment.findMany({
        where: { eventId: event.id },
      });

      for (const assignment of assignments) {
        await this.notificationService.createNotification({
          title: `New Calendar Event: ${data.title}`,
          message: data.description || `Event scheduled for ${data.startDate.toLocaleDateString()}`,
          type: 'event',
          priority: 'medium',
          employeeId: assignment.employeeId || undefined,
          doctorId: assignment.doctorId || undefined,
          staffId: assignment.staffId || undefined,
          eventId: event.id,
        });
      }
    }

    return event;
  }

  /**
   * Get all calendar events
   */
  async getAllEvents(filters?: {
    status?: EventStatus;
    eventType?: EventType;
    startDate?: Date;
    endDate?: Date;
  }): Promise<CalendarEvent[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.eventType) {
      where.eventType = filters.eventType;
    }
    if (filters?.startDate || filters?.endDate) {
      where.startDate = {};
      if (filters.startDate) {
        where.startDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.startDate.lte = filters.endDate;
      }
    }

    return await prisma.calendarEvent.findMany({
      where,
      include: {
        assignments: {
          include: {
            employee: {
              select: {
                id: true,
                empId: true,
                firstName: true,
                lastName: true,
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
            staff: {
              select: {
                id: true,
                empId: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  /**
   * Get events for a specific employee/doctor/staff
   */
  async getEventsForUser(userId: string, userType: 'employee' | 'doctor' | 'staff'): Promise<CalendarEvent[]> {
    const where: any = {
      OR: [
        { assignedToAll: true },
        {
          assignments: {
            some: {
              ...(userType === 'employee' && { employeeId: userId }),
              ...(userType === 'doctor' && { doctorId: userId }),
              ...(userType === 'staff' && { staffId: userId }),
            },
          },
        },
      ],
    };

    return await prisma.calendarEvent.findMany({
      where,
      include: {
        assignments: true,
      },
      orderBy: { startDate: 'asc' },
    });
  }

  /**
   * Update event status
   */
  async updateEventStatus(eventId: string, status: EventStatus): Promise<CalendarEvent> {
    return await prisma.calendarEvent.update({
      where: { id: eventId },
      data: { status },
    });
  }

  /**
   * Update event
   */
  async updateEvent(
    eventId: string,
    data: Partial<{
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      location: string;
      eventType: EventType;
      status: EventStatus;
    }>
  ): Promise<CalendarEvent> {
    return await prisma.calendarEvent.update({
      where: { id: eventId },
      data,
    });
  }

  /**
   * Delete event
   */
  async deleteEvent(eventId: string): Promise<void> {
    await prisma.calendarEvent.delete({
      where: { id: eventId },
    });
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit?: number): Promise<CalendarEvent[]> {
    return await prisma.calendarEvent.findMany({
      where: {
        status: 'upcoming',
        startDate: {
          gte: new Date(),
        },
      },
      orderBy: { startDate: 'asc' },
      take: limit,
    });
  }
}

export default new CalendarEventService();

