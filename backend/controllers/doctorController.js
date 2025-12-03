// controllers/doctorController.js
const { prisma } = require('../src/lib/prisma.js');

const doctorController = {
  // Get today's appointments for a doctor
  // ALWAYS returns appointments for Dr. Okonkwo Doctor
  getTodayAppointments: async (req, res) => {
    try {
      // ALWAYS use Dr. Okonkwo Doctor's ID
      let doctor = await prisma.doctor.findUnique({
        where: { email: 'doctor@hopephysicians.com' },
      });

      // If not found by email, try by name
      if (!doctor) {
        doctor = await prisma.doctor.findFirst({
          where: {
            firstName: 'Okonkwo',
            lastName: 'Doctor',
          },
        });
      }

      // If still not found, get the first doctor (fallback)
      if (!doctor) {
        doctor = await prisma.doctor.findFirst();
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Dr. Okonkwo Doctor not found in database' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointments = await prisma.appointment.findMany({
        where: {
          doctorId: doctor.id, // Always use Dr. Okonkwo Doctor's ID
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
              dateOfBirth: true,
              address: true,
            },
          },
        },
        orderBy: { time: 'asc' },
      });

      console.log(`✅ Fetched ${appointments.length} today's appointments for Dr. Okonkwo Doctor (ID: ${doctor.id})`);

      return res.json({ data: appointments });
    } catch (error) {
      console.error('❌ Error fetching today appointments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get doctor dashboard stats
  // ALWAYS returns stats for Dr. Okonkwo Doctor
  getDoctorStats: async (req, res) => {
    try {
      // ALWAYS use Dr. Okonkwo Doctor's ID
      let doctor = await prisma.doctor.findUnique({
        where: { email: 'doctor@hopephysicians.com' },
      });

      // If not found by email, try by name
      if (!doctor) {
        doctor = await prisma.doctor.findFirst({
          where: {
            firstName: 'Okonkwo',
            lastName: 'Doctor',
          },
        });
      }

      // If still not found, get the first doctor (fallback)
      if (!doctor) {
        doctor = await prisma.doctor.findFirst();
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Dr. Okonkwo Doctor not found in database' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get today's appointments count
      const todayAppointments = await prisma.appointment.count({
        where: {
          doctorId: doctor.id, // Always use Dr. Okonkwo Doctor's ID
          date: {
            gte: today,
            lt: tomorrow,
          },
          status: {
            not: 'cancelled',
          },
        },
      });

      // Get completed today count
      const completedToday = await prisma.appointment.count({
        where: {
          doctorId: doctor.id, // Always use Dr. Okonkwo Doctor's ID
          date: {
            gte: today,
            lt: tomorrow,
          },
          status: 'completed',
        },
      });

      // Get upcoming appointments (next 7 days)
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcoming = await prisma.appointment.count({
        where: {
          doctorId: doctor.id, // Always use Dr. Okonkwo Doctor's ID
          date: {
            gte: tomorrow,
            lte: nextWeek,
          },
          status: {
            not: 'cancelled',
          },
        },
      });

      // Get total unique patients
      const totalPatients = await prisma.appointment.groupBy({
        by: ['patientId'],
        where: {
          doctorId: doctor.id, // Always use Dr. Okonkwo Doctor's ID
        },
      });

      console.log(`✅ Stats for Dr. Okonkwo Doctor (ID: ${doctor.id}):`, {
        todayAppointments,
        upcoming,
        totalPatients: totalPatients.length,
        completedToday,
      });

      return res.json({
        todayAppointments,
        upcoming,
        totalPatients: totalPatients.length,
        completedToday,
      });
    } catch (error) {
      console.error('❌ Error fetching doctor stats:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Accept an appointment
  acceptAppointment: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Appointment ID is required' });
      }

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'confirmed',
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
      });

      return res.json({
        success: true,
        message: 'Appointment accepted successfully',
        data: appointment,
      });
    } catch (error) {
      console.error('❌ Error accepting appointment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all appointments for a doctor
  // ALWAYS returns appointments for Dr. Okonkwo Doctor regardless of doctorId parameter
  getAllAppointments: async (req, res) => {
    try {
      const { status } = req.query;

      // ALWAYS use Dr. Okonkwo Doctor's ID
      let doctor = await prisma.doctor.findUnique({
        where: { email: 'doctor@hopephysicians.com' },
      });

      // If not found by email, try by name
      if (!doctor) {
        doctor = await prisma.doctor.findFirst({
          where: {
            firstName: 'Okonkwo',
            lastName: 'Doctor',
          },
        });
      }

      // If still not found, get the first doctor (fallback)
      if (!doctor) {
        doctor = await prisma.doctor.findFirst();
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Dr. Okonkwo Doctor not found in database' });
      }

      // Build where clause - NO DATE FILTERS, show all appointments
      const where = { doctorId: doctor.id };
      if (status) where.status = status;
      // Removed date filters - show all appointments regardless of date

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              dateOfBirth: true,
              address: true,
            },
          },
        },
        orderBy: [
          { date: 'desc' }, // Newest first
          { time: 'asc' },
        ],
      });

      console.log(`✅ Fetched ${appointments.length} appointments for Dr. Okonkwo Doctor (ID: ${doctor.id})`);
      if (appointments.length > 0) {
        console.log(`   Appointments:`, appointments.map(apt => ({
          id: apt.id,
          patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
          date: apt.date,
          status: apt.status
        })));
      }

      return res.json({ data: appointments });
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = doctorController;

