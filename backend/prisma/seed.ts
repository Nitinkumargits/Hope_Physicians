import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if database is already seeded
  const existingAdmin = await prisma.portalUser.findUnique({
    where: { email: 'admin@hopephysicians.com' },
  });

  if (existingAdmin) {
    console.log('✅ Database already seeded. Skipping seed process.\n');
    return;
  }

  // Hash passwords
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedDoctorPassword = await bcrypt.hash('doctor123', 10);
  const hashedPatientPassword = await bcrypt.hash('patient123', 10);
  const hashedStaffPassword = await bcrypt.hash('staff123', 10);

  // ============================================
  // CREATE EMPLOYEES
  // ============================================
  console.log('👥 Creating employees...');

  const adminEmployee = await prisma.employee.create({
    data: {
      empId: 'ADM1001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@hopephysicians.com',
      phone: '(252) 555-0001',
      designation: 'Administrator',
      department: 'Administration',
      status: 'working',
      isActive: true,
      joiningDate: new Date('2020-01-15'),
    },
  });

  const doctorEmployee = await prisma.employee.create({
    data: {
      empId: 'DOC1001',
      firstName: 'Okonkwo',
      lastName: 'Doctor',
      email: 'doctor@hopephysicians.com',
      phone: '(252) 555-0002',
      designation: 'Family Medicine Physician',
      department: 'Family Medicine',
      status: 'working',
      isActive: true,
      joiningDate: new Date('2021-03-10'),
    },
  });

  const staffEmployee = await prisma.employee.create({
    data: {
      empId: 'STF1001',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'staff@hopephysicians.com',
      phone: '(252) 555-0003',
      designation: 'Administrative Staff',
      department: 'Administration',
      status: 'working',
      isActive: true,
      joiningDate: new Date('2022-06-01'),
    },
  });

  console.log('✅ Employees created');

  // ============================================
  // CREATE DOCTOR
  // ============================================
  console.log('👨‍⚕️ Creating doctor...');

  const doctor = await prisma.doctor.create({
    data: {
      empId: doctorEmployee.empId,
      firstName: 'Okonkwo',
      lastName: 'Doctor',
      email: 'doctor@hopephysicians.com',
      phone: '(252) 555-0002',
      specialization: 'Family Medicine',
      licenseNumber: 'NC-MD-12345',
      yearsOfExperience: 10,
      bio: 'Experienced family medicine physician with expertise in preventive care.',
      isAvailable: true,
    },
  });

  console.log('✅ Doctor created');

  // ============================================
  // CREATE STAFF
  // ============================================
  console.log('👥 Creating staff...');

  const staff = await prisma.staff.create({
    data: {
      empId: staffEmployee.empId,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'staff@hopephysicians.com',
      phone: '(252) 555-0003',
      designation: 'Administrative Staff',
      department: 'Administration',
    },
  });

  console.log('✅ Staff created');

  // ============================================
  // CREATE PATIENT
  // ============================================
  console.log('👤 Creating patient...');

  const patient = await prisma.patient.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'patient@example.com',
      phone: '(252) 555-0101',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Male',
      address: '123 Main St',
      city: 'Kinston',
      state: 'NC',
      zipCode: '28501',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '(252) 555-0102',
      insuranceProvider: 'Blue Cross Blue Shield',
      insuranceNumber: 'BC123456789',
      kycStatus: 'pending',
    },
  });

  console.log('✅ Patient created');

  // ============================================
  // CREATE PORTAL USERS
  // ============================================
  console.log('🔐 Creating portal users...');

  const adminUser = await prisma.portalUser.create({
    data: {
      email: 'admin@hopephysicians.com',
      passwordHash: hashedAdminPassword,
      role: 'admin',
      isActive: true,
      canAccessSystem: true,
      employeeId: adminEmployee.id,
    },
  });

  const doctorUser = await prisma.portalUser.create({
    data: {
      email: 'doctor@hopephysicians.com',
      passwordHash: hashedDoctorPassword,
      role: 'doctor',
      isActive: true,
      canAccessSystem: true,
      employeeId: doctorEmployee.id,
      doctorId: doctor.id,
    },
  });

  const patientUser = await prisma.portalUser.create({
    data: {
      email: 'patient@example.com',
      passwordHash: hashedPatientPassword,
      role: 'patient',
      isActive: true,
      canAccessSystem: true,
      patientId: patient.id,
    },
  });

  const staffUser = await prisma.portalUser.create({
    data: {
      email: 'staff@hopephysicians.com',
      passwordHash: hashedStaffPassword,
      role: 'staff',
      isActive: true,
      canAccessSystem: true,
      employeeId: staffEmployee.id,
      staffId: staff.id,
    },
  });

  console.log('✅ Portal users created');

  // ============================================
  // CREATE APPOINTMENTS
  // ============================================
  console.log('📅 Creating appointments...');

  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      date: new Date('2024-01-20'),
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'scheduled',
      notes: 'Regular checkup',
      department: 'Family Medicine',
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      date: new Date('2024-01-21'),
      time: '02:00 PM',
      type: 'Consultation',
      status: 'scheduled',
      notes: 'New patient consultation',
      department: 'Family Medicine',
    },
  });

  console.log('✅ Appointments created');

  // ============================================
  // CREATE ATTENDANCE RECORDS
  // ============================================
  console.log('⏰ Creating attendance records...');

  const attendance1 = await prisma.attendance.create({
    data: {
      employeeId: staffEmployee.id,
      staffId: staff.id,
      checkInTime: new Date('2024-01-19T09:00:00Z'),
      checkInLocation: 'Main Office',
      checkOutTime: new Date('2024-01-19T17:30:00Z'),
      checkOutLocation: 'Main Office',
      workingHours: 8.5,
      status: 'present',
    },
  });

  const attendance2 = await prisma.attendance.create({
    data: {
      employeeId: staffEmployee.id,
      staffId: staff.id,
      checkInTime: new Date('2024-01-20T08:45:00Z'),
      checkInLocation: 'Main Office',
      checkOutTime: new Date('2024-01-20T17:15:00Z'),
      checkOutLocation: 'Main Office',
      workingHours: 8.5,
      status: 'present',
    },
  });

  // Current day check-in (no check-out yet)
  const attendance3 = await prisma.attendance.create({
    data: {
      employeeId: staffEmployee.id,
      staffId: staff.id,
      checkInTime: new Date(),
      checkInLocation: 'Main Office',
      status: 'present',
    },
  });

  console.log('✅ Attendance records created');

  // ============================================
  // CREATE KYC DOCUMENTS
  // ============================================
  console.log('📄 Creating KYC documents...');

  const kycDocument = await prisma.kYCDocument.create({
    data: {
      patientId: patient.id,
      salarySlip1: '/uploads/kyc/patient-1/salary-slip-1.pdf',
      salarySlip2: '/uploads/kyc/patient-1/salary-slip-2.pdf',
      salarySlip3: '/uploads/kyc/patient-1/salary-slip-3.pdf',
      cancelledCheque: '/uploads/kyc/patient-1/cancelled-cheque.pdf',
      aadhaarFront: '/uploads/kyc/patient-1/aadhaar-front.jpg',
      aadhaarBack: '/uploads/kyc/patient-1/aadhaar-back.jpg',
      educationalDoc1: '/uploads/kyc/patient-1/degree.pdf',
      status: 'pending',
      resubmissionRequested: false,
    },
  });

  console.log('✅ KYC documents created');

  // ============================================
  // CREATE CALENDAR EVENTS
  // ============================================
  console.log('📆 Creating calendar events...');

  const event1 = await prisma.calendarEvent.create({
    data: {
      title: 'Monthly Team Meeting',
      description: 'All staff monthly meeting',
      startDate: new Date('2024-01-25T10:00:00Z'),
      endDate: new Date('2024-01-25T11:00:00Z'),
      location: 'Conference Room A',
      eventType: 'meeting',
      status: 'upcoming',
      assignedToAll: true,
      createdBy: adminEmployee.id,
    },
  });

  const event2 = await prisma.calendarEvent.create({
    data: {
      title: 'Training Session: New System',
      description: 'Training on new patient management system',
      startDate: new Date('2024-01-22T14:00:00Z'),
      endDate: new Date('2024-01-22T16:00:00Z'),
      location: 'Training Room',
      eventType: 'training',
      status: 'upcoming',
      assignedToAll: false,
      createdBy: adminEmployee.id,
      assignments: {
        create: [
          { employeeId: staffEmployee.id },
          { doctorId: doctor.id },
        ],
      },
    },
  });

  console.log('✅ Calendar events created');

  // ============================================
  // CREATE NOTIFICATIONS
  // ============================================
  console.log('🔔 Creating notifications...');

  // Notification for calendar event
  await prisma.notification.create({
    data: {
      title: 'New Calendar Event',
      message: 'Monthly Team Meeting scheduled for January 25, 2024',
      type: 'event',
      priority: 'medium',
      status: 'unread',
      allEmployees: true,
      eventId: event1.id,
    },
  });

  // Notification for KYC submission
  await prisma.notification.create({
    data: {
      title: 'New KYC Submission',
      message: 'John Doe has submitted KYC documents requiring review',
      type: 'kyc',
      priority: 'high',
      status: 'unread',
      employeeId: adminEmployee.id,
      kycDocumentId: kycDocument.id,
    },
  });

  // Notification for appointment
  await prisma.notification.create({
    data: {
      title: 'Appointment Reminder',
      message: 'You have an appointment scheduled for tomorrow at 10:00 AM',
      type: 'appointment',
      priority: 'medium',
      status: 'unread',
      doctorId: doctor.id,
      appointmentId: appointment1.id,
    },
  });

  console.log('✅ Notifications created');

  // ============================================
  // CREATE TASKS
  // ============================================
  console.log('✅ Creating tasks...');

  await prisma.task.create({
    data: {
      staffId: staff.id,
      title: 'Process Insurance Forms',
      description: 'Review and process pending insurance claim forms',
      status: 'pending',
      priority: 'high',
      dueDate: new Date('2024-01-25'),
    },
  });

  await prisma.task.create({
    data: {
      staffId: staff.id,
      title: 'Update Patient Records',
      description: 'Update patient contact information in the system',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date('2024-01-23'),
    },
  });

  await prisma.task.create({
    data: {
      staffId: staff.id,
      title: 'File Medical Reports',
      description: 'Organize and file completed medical reports',
      status: 'completed',
      priority: 'low',
      dueDate: new Date('2024-01-20'),
      completedAt: new Date('2024-01-19'),
    },
  });

  console.log('✅ Tasks created');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - Employees: 3`);
  console.log(`   - Doctors: 1`);
  console.log(`   - Staff: 1`);
  console.log(`   - Patients: 1`);
  console.log(`   - Portal Users: 4`);
  console.log(`   - Appointments: 2`);
  console.log(`   - Attendance Records: 3`);
  console.log(`   - KYC Documents: 1`);
  console.log(`   - Calendar Events: 2`);
  console.log(`   - Notifications: 3`);
  console.log(`   - Tasks: 3`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

