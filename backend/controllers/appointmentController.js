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
      
      // Format appointment date
      const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail, // Development email: test.nitin.employee@gmail.com
        subject: `New Appointment from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #004aad; margin: 0; font-size: 28px;">Hope Physicians</h1>
              </div>
              
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 20px;">📅 New Appointment Details</h2>
                <p style="color: #1e3a8a; margin: 0; font-size: 14px;">A new appointment request has been received.</p>
              </div>

              <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Appointment Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Patient Name:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Department:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${department}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${appointmentTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Assigned Doctor:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${doctorName} (${doctor.specialization})</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Appointment ID:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${appointment.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
                    <td style="padding: 8px 0;">
                      <span style="background-color: #fbbf24; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">Scheduled</span>
                    </td>
                  </tr>
                </table>
              </div>

              ${message ? `
              <div style="margin-bottom: 25px;">
                <h3 style="color: #111827; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Message:</h3>
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding: 12px; background-color: #f9fafb; border-radius: 4px;">
                  ${message}
                </p>
              </div>
              ` : ''}

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>Note:</strong> This appointment is pending doctor confirmation. The patient will be notified once the appointment is accepted.
                </p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                  For any questions or concerns, please contact us:
                </p>
                <p style="color: #374151; font-size: 14px; margin: 5px 0;">
                  <strong>Phone:</strong> (252) 522-3663
                </p>
                <p style="color: #374151; font-size: 14px; margin: 5px 0;">
                  <strong>Email:</strong> info@hopephysicians.com
                </p>
              </div>

              <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  This is an automated email. Please do not reply to this message.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                  © ${new Date().getFullYear()} Hope Physicians. All rights reserved.
                </p>
              </div>
            </div>
          </div>
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
  getAllAppointments: async (req, res) => {
    try {
      const { status, date, limit = 100 } = req.query;
      
      const where = {};
      if (status) where.status = status;
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        where.date = {
          gte: startOfDay,
          lte: endOfDay
        };
      }

      const appointments = await prisma.appointment.findMany({
        where,
        take: parseInt(limit),
        orderBy: [
          { date: 'desc' },
          { time: 'asc' }
        ],
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true
            }
          }
        }
      });

      console.log(`📋 Admin fetched all appointments. Total: ${appointments.length}`);

      return res.json({ 
        success: true,
        data: appointments,
        total: appointments.length
      });
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
};

module.exports = appointmentController;
