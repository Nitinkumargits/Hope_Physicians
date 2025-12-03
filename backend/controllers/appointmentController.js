// controllers/appointmentController.js
const Appointment = require('../models/appointmentModel'); // Keep for backward compatibility
const { prisma } = require('../src/lib/prisma.js');
const transporter = require('../config/mailer'); // Nodemailer transporter
require('dotenv').config();

const appointmentController = {
  // Handle new appointment submission
  createAppointment: async (req, res) => {
    try {
      console.log('📥 Received appointment request:', {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        department: req.body.department,
        preferredDate: req.body.preferredDate,
        preferredTime: req.body.preferredTime,
        message: req.body.message,
      });

      const { name, email, phone, department, preferredDate, preferredTime, message } = req.body;

      // Basic validation
      if (!name || !email || !phone || !department) {
        console.log('Appointment submission failed: Missing required fields.');
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      // Parse name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || '';

      // Find or create patient
      let patient = await prisma.patient.findUnique({
        where: { email },
      });

      if (!patient) {
        patient = await prisma.patient.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            kycStatus: 'pending',
          },
        });
        console.log(`✅ Created new patient: ${firstName} ${lastName}`);
      }

      // ALWAYS assign to Dr. Okonkwo Doctor (for development/testing)
      // Find Dr. Okonkwo Doctor by email
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
        console.log(`⚠️ Dr. Okonkwo Doctor not found, using first available doctor...`);
        doctor = await prisma.doctor.findFirst({
          where: { isAvailable: true },
        });
      }

      // Last resort: get any doctor
      if (!doctor) {
        doctor = await prisma.doctor.findFirst();
      }

      if (doctor) {
        console.log(`✅ ALWAYS assigning to Dr. Okonkwo Doctor: ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.id})`);
      } else {
        console.error('❌ No doctor found in database');
        // Still save to old database for backward compatibility
        const appointmentId = Appointment.create({ name, email, phone, department, message });
        return res.status(201).json({ 
          message: 'Appointment request submitted. We will assign a doctor and contact you soon.', 
          appointmentId 
        });
      }

      // Parse date and time
      let appointmentDate;
      if (preferredDate) {
        // Parse the date string (format: YYYY-MM-DD)
        const [year, month, day] = preferredDate.split('-').map(Number);
        appointmentDate = new Date(year, month - 1, day);
        appointmentDate.setHours(0, 0, 0, 0);
      } else {
        // Default to today if no date provided
        appointmentDate = new Date();
        appointmentDate.setHours(0, 0, 0, 0);
      }
      const appointmentTime = preferredTime || '10:00 AM';

      // Create appointment in Prisma
      console.log('📝 Creating appointment with data:', {
        patientId: patient.id,
        doctorId: doctor.id,
        date: appointmentDate,
        time: appointmentTime,
        type: 'Consultation',
        status: 'scheduled',
        notes: message || '',
        department: department,
      });

      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          date: appointmentDate,
          time: appointmentTime,
          type: 'Consultation',
          status: 'scheduled',
          notes: message || '',
          department: department,
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

      console.log('------------------------------------------');
      console.log(`✅ Appointment created successfully!`);
      console.log(`   Appointment ID: ${appointment.id}`);
      console.log(`   Patient: ${appointment.patient.firstName} ${appointment.patient.lastName}`);
      console.log(`   Assigned Doctor: ${appointment.doctor.firstName} ${appointment.doctor.lastName} (ID: ${appointment.doctor.id})`);
      console.log(`   Doctor Specialization: ${appointment.doctor.specialization}`);
      console.log(`   Department Requested: ${department}`);
      console.log(`   Date: ${appointmentDate.toLocaleDateString()} (ISO: ${appointmentDate.toISOString()})`);
      console.log(`   Time: ${appointmentTime}`);
      console.log(`   Status: ${appointment.status}`);
      console.log('------------------------------------------');

      // Verify appointment was saved by fetching it back
      const verifyAppointment = await prisma.appointment.findUnique({
        where: { id: appointment.id },
        include: {
          patient: true,
          doctor: true,
        },
      });

      if (verifyAppointment) {
        console.log(`✅ Verification: Appointment ${appointment.id} exists in database`);
        console.log(`   Doctor ID in DB: ${verifyAppointment.doctorId}`);
        console.log(`   Expected Doctor ID: ${doctor.id}`);
        if (verifyAppointment.doctorId !== doctor.id) {
          console.error(`❌ ERROR: Doctor ID mismatch! Expected ${doctor.id}, got ${verifyAppointment.doctorId}`);
        }
      } else {
        console.error(`❌ ERROR: Appointment ${appointment.id} not found after creation!`);
      }

      // Also save to old database for backward compatibility
      try {
        Appointment.create({ name, email, phone, department, message });
      } catch (oldDbError) {
        console.warn('Could not save to old database:', oldDbError.message);
      }

      // Log the appointment submission
      console.log('------------------------------------------');
      console.log(`✅ New appointment created!`);
      console.log(`   Patient: ${patient.firstName} ${patient.lastName}`);
      console.log(`   Doctor: ${doctor.firstName} ${doctor.lastName}`);
      console.log(`   Date: ${appointmentDate.toLocaleDateString()}`);
      console.log(`   Time: ${appointmentTime}`);
      console.log(`   Appointment ID: ${appointment.id}`);

      // Send email notification
      // For development: send to test.nitin.employee@gmail.com
      const recipientEmail = process.env.APPOINTMENT_EMAIL || 'test.nitin.employee@gmail.com';
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail, // Development email: test.nitin.employee@gmail.com
        subject: `New Appointment from ${name}`,
        html: `
          <h3>New Appointment Details</h3>
          <p><strong>Patient Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Date:</strong> ${appointmentDate.toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          <p><strong>Assigned Doctor:</strong> ${doctor.firstName} ${doctor.lastName} (${doctor.specialization})</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
          <p><strong>Appointment ID:</strong> ${appointment.id}</p>
        `
      };

      await transporter.sendMail(mailOptions);

      console.log(`📧 Email sent successfully for appointment ID: ${appointment.id}`);

      // Return success response with full appointment details
      const response = {
        message: 'Appointment submitted successfully.',
        appointmentId: appointment.id,
        appointment: {
          id: appointment.id,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          doctor: {
            id: doctor.id,
            name: `${doctor.firstName} ${doctor.lastName}`,
            specialization: doctor.specialization,
          },
          patient: {
            id: patient.id,
            name: `${patient.firstName} ${patient.lastName}`,
            email: patient.email,
          },
        },
      };

      console.log('📤 Sending response:', response);
      return res.status(201).json(response);
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all appointments (for admin dashboard)
  getAllAppointments: (req, res) => {
    try {
      const appointments = Appointment.getAll();

      console.log(`📋 Admin fetched all appointments. Total: ${appointments.length}`);

      return res.json({ appointments });
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = appointmentController;
