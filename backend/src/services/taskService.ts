import { PrismaClient, Task, TaskStatus, TaskPriority } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Task Service - CRUD operations for Task model
 */

export class TaskService {
  /**
   * Create a new task
   */
  async createTask(data: {
    staffId: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date;
  }): Promise<Task> {
    return await prisma.task.create({
      data: {
        ...data,
        status: 'pending',
        priority: data.priority || 'medium',
      },
    });
  }

  /**
   * Get all tasks for a staff member
   */
  async getTasksByStaff(
    staffId: string,
    filters?: {
      status?: TaskStatus;
      priority?: TaskPriority;
    }
  ): Promise<Task[]> {
    const where: any = { staffId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }

    return await prisma.task.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: { id },
      include: {
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
  }

  /**
   * Update task
   */
  async updateTask(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: Date;
    }>
  ): Promise<Task> {
    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  /**
   * Start task (set status to in_progress)
   */
  async startTask(id: string): Promise<Task> {
    return await prisma.task.update({
      where: { id },
      data: {
        status: 'in_progress',
      },
    });
  }

  /**
   * Complete task
   */
  async completeTask(id: string): Promise<Task> {
    return await prisma.task.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  /**
   * Cancel task
   */
  async cancelTask(id: string): Promise<Task> {
    return await prisma.task.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }

  /**
   * Get pending tasks for a staff member
   */
  async getPendingTasks(staffId: string): Promise<Task[]> {
    return await prisma.task.findMany({
      where: {
        staffId,
        status: {
          in: ['pending', 'in_progress'],
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(staffId?: string): Promise<Task[]> {
    const where: any = {
      dueDate: {
        lt: new Date(),
      },
      status: {
        not: 'completed',
      },
    };

    if (staffId) {
      where.staffId = staffId;
    }

    return await prisma.task.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });
  }
}

export default new TaskService();

