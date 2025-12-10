// controllers/patientController.js
const { prisma } = require('../src/lib/prisma.js');

const patientController = {
  // Get patient by ID with all related data
  getPatientById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      // First get Dr. Okonkwo Doctor's ID
      let doctor = await prisma.doctor.findUnique({
        where: { email: 'doctor@hopephysicians.com' },
      });

      if (!doctor) {
        doctor = await prisma.doctor.findFirst({
          where: {
            firstName: 'Okonkwo',
            lastName: 'Doctor',
          },
        });
      }

      if (!doctor) {
        doctor = await prisma.doctor.findFirst();
      }

      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          appointments: {
            where: doctor ? {
              doctorId: doctor.id, // Only show appointments for Dr. Okonkwo Doctor
            } : undefined,
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
            orderBy: [
              { date: 'desc' },
              { time: 'asc' },
            ],
          },
          kycDocuments: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      console.log(`✅ Fetched patient ${patient.firstName} ${patient.lastName} (ID: ${patient.id})`);
      console.log(`   Appointments: ${patient.appointments.length}`);

      return res.json({ data: patient });
    } catch (error) {
      console.error('❌ Error fetching patient:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all patients (for doctor's patient list)
  getAllPatients: async (req, res) => {
    try {
      const { search, kycStatus, doctorId } = req.query;

      // Use doctorId from query param, or from authenticated user, or fallback to Dr. Okonkwo Doctor
      let doctor = null;
      
      // Priority 1: Use doctorId from query parameter (for API calls)
      if (doctorId) {
        doctor = await prisma.doctor.findUnique({
          where: { id: doctorId },
        });
      }
      
      // Priority 2: Use doctorId from authenticated user (from JWT token)
      if (!doctor && req.user && req.user.doctorId) {
        doctor = await prisma.doctor.findUnique({
          where: { id: req.user.doctorId },
        });
      }
      
      // Priority 3: Fallback to Dr. Okonkwo Doctor (for backward compatibility)
      if (!doctor) {
        doctor = await prisma.doctor.findUnique({
          where: { email: 'doctor@hopephysicians.com' },
        });
      }

      if (!doctor) {
        doctor = await prisma.doctor.findFirst({
          where: {
            firstName: 'Okonkwo',
            lastName: 'Doctor',
          },
        });
      }

      if (!doctor) {
        doctor = await prisma.doctor.findFirst();
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found in database' });
      }

      // Get all patients who have appointments with this doctor
      const where = {
        appointments: {
          some: {
            doctorId: doctor.id,
          },
        },
      };

      if (search) {
        const searchLower = search.toLowerCase();
        where.OR = [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ];
      }

      if (kycStatus) {
        where.kycStatus = kycStatus;
      }

      const patients = await prisma.patient.findMany({
        where,
        include: {
          appointments: {
            where: {
              doctorId: doctor.id,
            },
            orderBy: { date: 'desc' },
            take: 1, // Get only the most recent appointment
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      console.log(`✅ Fetched ${patients.length} patients for doctor ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.id})`);

      return res.json({ data: patients });
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = patientController;

