import { PrismaClient, Employee, EmployeeStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Employee Service - CRUD operations for Employee model
 * Implements soft delete using isActive field
 * Only Admin & HR can soft-delete employees
 */

export class EmployeeService {
  /**
   * Create a new employee
   */
  async createEmployee(data: {
    empId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    designation?: string;
    department?: string;
    joiningDate?: Date;
    status?: EmployeeStatus;
  }): Promise<Employee> {
    // Check if empId already exists
    const existing = await prisma.employee.findUnique({
      where: { empId: data.empId },
    });

    if (existing) {
      throw new Error(`Employee with ID ${data.empId} already exists`);
    }

    return await prisma.employee.create({
      data: {
        ...data,
        status: data.status || 'working',
        isActive: true,
      },
    });
  }

  /**
   * Get all active employees
   */
  async getAllEmployees(includeInactive: boolean = false): Promise<Employee[]> {
    const where = includeInactive ? {} : { isActive: true };

    return await prisma.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee | null> {
    return await prisma.employee.findUnique({
      where: { id },
    });
  }

  /**
   * Get employee by Employee ID (empId)
   */
  async getEmployeeByEmpId(empId: string): Promise<Employee | null> {
    return await prisma.employee.findUnique({
      where: { empId },
    });
  }

  /**
   * Update employee
   */
  async updateEmployee(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      designation: string;
      department: string;
      status: EmployeeStatus;
    }>
  ): Promise<Employee> {
    return await prisma.employee.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft delete employee (set isActive = false)
   * Only Admin & HR can perform this action
   */
  async softDeleteEmployee(id: string, deletedBy: string): Promise<Employee> {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return await prisma.employee.update({
      where: { id },
      data: {
        isActive: false,
        status: 'not_working',
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restore soft-deleted employee (set isActive = true)
   */
  async restoreEmployee(id: string): Promise<Employee> {
    return await prisma.employee.update({
      where: { id },
      data: {
        isActive: true,
        status: 'working',
        deletedAt: null,
      },
    });
  }

  /**
   * Generate next employee ID (e.g., RST1001, RST1002)
   */
  async generateNextEmpId(prefix: string = 'RST'): Promise<string> {
    const lastEmployee = await prisma.employee.findFirst({
      where: {
        empId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        empId: 'desc',
      },
    });

    if (!lastEmployee) {
      return `${prefix}1001`;
    }

    const lastNumber = parseInt(lastEmployee.empId.replace(prefix, ''));
    const nextNumber = lastNumber + 1;

    return `${prefix}${nextNumber}`;
  }

  /**
   * Get employees by status
   */
  async getEmployeesByStatus(status: EmployeeStatus): Promise<Employee[]> {
    return await prisma.employee.findMany({
      where: {
        status,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get employees by department
   */
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    return await prisma.employee.findMany({
      where: {
        department,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new EmployeeService();

