# Prisma ORM Setup Guide - Hope Physicians

This guide will help you set up Prisma ORM with SQLite for the Hope Physicians project.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Basic knowledge of SQL and TypeScript

## 🚀 Installation Steps

### 1. Install Prisma and Dependencies

```bash
cd backend
npm install
```

This will install:
- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI (dev dependency)
- `ts-node` - TypeScript execution (dev dependency)
- `typescript` - TypeScript compiler (dev dependency)

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 3. Create Database and Run Migrations

```bash
npm run prisma:migrate
```

This will:
- Create the SQLite database file at `/prisma/hope_physicians.db`
- Generate migration files
- Apply migrations to create all tables

**Note:** When prompted for a migration name, enter something descriptive like `init` or `initial_schema`.

### 4. Seed the Database (Optional)

```bash
npm run prisma:seed
```

This will populate the database with sample data including:
- Admin, Doctor, Patient, Staff users
- Sample appointments
- Attendance records
- KYC documents
- Calendar events
- Notifications
- Tasks

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition
│   ├── seed.ts                # Database seed script
│   └── hope_physicians.db     # SQLite database file (generated)
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Prisma Client singleton
│   └── services/
│       ├── employeeService.ts
│       ├── attendanceService.ts
│       ├── appointmentService.ts
│       ├── kycService.ts
│       ├── calendarEventService.ts
│       ├── notificationService.ts
│       ├── portalUserService.ts
│       ├── patientService.ts
│       ├── doctorService.ts
│       ├── staffService.ts
│       └── taskService.ts
└── package.json
```

## 🔧 Available Scripts

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npm run prisma:reset
```

## 📊 Database Schema Overview

### Core Models

1. **PortalUser** - Authentication and user management
2. **Employee** - Employee records with soft delete
3. **Doctor** - Doctor profiles and specializations
4. **Staff** - Staff member records
5. **Patient** - Patient information and KYC status
6. **Attendance** - Check-in/check-out records
7. **KYCDocument** - KYC document uploads and reviews
8. **Appointment** - Patient appointments with doctors
9. **CalendarEvent** - Calendar events and assignments
10. **Notification** - System notifications
11. **Task** - Staff task management

## 🔐 Default Login Credentials (After Seeding)

After running the seed script, you can use these credentials:

### Admin
- Email: `admin@hopephysicians.com`
- Password: `admin123`
- Role: `admin`

### Doctor
- Email: `doctor@hopephysicians.com`
- Password: `doctor123`
- Role: `doctor`

### Patient
- Email: `patient@example.com`
- Password: `patient123`
- Role: `patient`

### Staff
- Email: `staff@hopephysicians.com`
- Password: `staff123`
- Role: `staff`

## 💻 Usage Examples

### Using Services in Your Code

```typescript
import { EmployeeService } from './services/employeeService';
import { AttendanceService } from './services/attendanceService';
import { AppointmentService } from './services/appointmentService';

// Create an employee
const employee = await EmployeeService.createEmployee({
  empId: 'RST1002',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '(252) 555-0100',
  designation: 'Nurse',
  department: 'Emergency',
});

// Check in an employee
const attendance = await AttendanceService.checkIn({
  employeeId: employee.id,
  checkInLocation: 'Main Office',
});

// Create an appointment
const appointment = await AppointmentService.createAppointment({
  patientId: 'patient-id',
  doctorId: 'doctor-id',
  date: new Date('2024-01-25'),
  time: '10:00 AM',
  type: 'Consultation',
});
```

### Direct Prisma Client Usage

```typescript
import { prisma } from './lib/prisma';

// Query example
const employees = await prisma.employee.findMany({
  where: {
    isActive: true,
    status: 'working',
  },
  include: {
    attendance: {
      orderBy: { checkInTime: 'desc' },
      take: 5,
    },
  },
});
```

## 🔄 Making Schema Changes

1. **Edit `prisma/schema.prisma`** - Make your changes
2. **Create migration**: `npm run prisma:migrate`
3. **Generate client**: `npm run prisma:generate` (auto-run after migrate)

## 📝 Key Features

### Soft Delete
- Employees use `isActive` field for soft delete
- Only Admin & HR can soft-delete employees
- Records are never physically deleted

### Attendance Tracking
- Stores check-in time, photo, and location
- Working hours computed only after check-out
- Supports partial day attendance

### KYC Document Management
- Supports 3 month salary slips
- Cancelled cheque/passbook
- Aadhaar front/back
- Educational documents
- Admin can reject with remarks and request resubmission

### Calendar Events
- Can be assigned to all employees or specific users
- Automatically creates notifications
- Supports multiple event types

### Notifications
- Created automatically for calendar events
- Supports different priorities
- Can be assigned to specific users or broadcast to all

## 🛠️ Troubleshooting

### Database Locked Error
If you get a "database is locked" error:
1. Close Prisma Studio if it's open
2. Make sure no other process is using the database
3. Try again

### Migration Errors
If migrations fail:
1. Check your schema for syntax errors
2. Ensure all required fields have defaults or are optional
3. Review the migration SQL files in `prisma/migrations/`

### Seed Errors
If seeding fails:
1. Make sure migrations have been run
2. Check that all required fields are provided
3. Verify email addresses are unique

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma SQLite Guide](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## 🎯 Next Steps

1. Integrate services into your Express routes
2. Add authentication middleware
3. Implement file upload for KYC documents and attendance photos
4. Add validation and error handling
5. Set up environment variables for production

## 📞 Support

For issues or questions:
1. Check the Prisma documentation
2. Review the service files for examples
3. Use Prisma Studio to inspect the database: `npm run prisma:studio`

