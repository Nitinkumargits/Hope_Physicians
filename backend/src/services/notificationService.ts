import { PrismaClient, Notification, NotificationType, NotificationPriority, NotificationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Notification Service - CRUD operations for Notification model
 */

export class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(data: {
    title: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    employeeId?: string;
    doctorId?: string;
    patientId?: string;
    staffId?: string;
    allEmployees?: boolean;
    eventId?: string;
    appointmentId?: string;
    kycDocumentId?: string;
  }): Promise<Notification> {
    // If allEmployees is true, create notifications for all active employees
    if (data.allEmployees) {
      const employees = await prisma.employee.findMany({
        where: { isActive: true },
      });

      const notifications = await Promise.all(
        employees.map((emp) =>
          prisma.notification.create({
            data: {
              title: data.title,
              message: data.message,
              type: data.type,
              priority: data.priority || 'medium',
              status: 'unread',
              employeeId: emp.id,
              eventId: data.eventId,
              appointmentId: data.appointmentId,
              kycDocumentId: data.kycDocumentId,
            },
          })
        )
      );

      return notifications[0]; // Return first notification as reference
    }

    // Create single notification
    return await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority || 'medium',
        status: 'unread',
        employeeId: data.employeeId,
        doctorId: data.doctorId,
        patientId: data.patientId,
        staffId: data.staffId,
        eventId: data.eventId,
        appointmentId: data.appointmentId,
        kycDocumentId: data.kycDocumentId,
      },
    });
  }

  /**
   * Get notifications for a user
   */
  async getNotificationsForUser(
    userId: string,
    userType: 'employee' | 'doctor' | 'patient' | 'staff',
    filters?: {
      status?: NotificationStatus;
      type?: NotificationType;
      unreadOnly?: boolean;
    }
  ): Promise<Notification[]> {
    const where: any = {};

    if (userType === 'employee') {
      where.employeeId = userId;
    } else if (userType === 'doctor') {
      where.doctorId = userId;
    } else if (userType === 'patient') {
      where.patientId = userId;
    } else if (userType === 'staff') {
      where.staffId = userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.unreadOnly) {
      where.status = 'unread';
    }

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
          },
        },
        appointment: {
          select: {
            id: true,
            date: true,
            time: true,
          },
        },
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(
    userId: string,
    userType: 'employee' | 'doctor' | 'patient' | 'staff'
  ): Promise<{ count: number }> {
    const where: any = {
      status: 'unread',
    };

    if (userType === 'employee') {
      where.employeeId = userId;
    } else if (userType === 'doctor') {
      where.doctorId = userId;
    } else if (userType === 'patient') {
      where.patientId = userId;
    } else if (userType === 'staff') {
      where.staffId = userId;
    }

    return await prisma.notification.updateMany({
      where,
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(
    userId: string,
    userType: 'employee' | 'doctor' | 'patient' | 'staff'
  ): Promise<number> {
    const where: any = {
      status: 'unread',
    };

    if (userType === 'employee') {
      where.employeeId = userId;
    } else if (userType === 'doctor') {
      where.doctorId = userId;
    } else if (userType === 'patient') {
      where.patientId = userId;
    } else if (userType === 'staff') {
      where.staffId = userId;
    }

    return await prisma.notification.count({ where });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string): Promise<Notification> {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'archived',
      },
    });
  }
}

export default new NotificationService();

