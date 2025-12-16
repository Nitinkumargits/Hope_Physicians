// controllers/doctorController.js
const { prisma } = require('../src/lib/prisma.js');
const transporter = require('../config/mailer');
require('dotenv').config();

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

      // Get appointment with patient and doctor details
      const appointment = await prisma.appointment.findUnique({
        where: { id },
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

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Update appointment status to confirmed
      const updatedAppointment = await prisma.appointment.update({
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

      // Format appointment date and time
      const appointmentDate = appointment.date 
        ? new Date(appointment.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : 'TBD';
      const appointmentTime = appointment.time || 'TBD';

      // Send email to patient
      const patientEmail = appointment.patient.email;
      const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
      const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: 'Appointment Accepted - Hope Physicians',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #004aad; margin: 0; font-size: 28px;">Hope Physicians</h1>
              </div>
              
              <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <h2 style="color: #065f46; margin: 0 0 10px 0; font-size: 20px;">✓ Appointment Accepted</h2>
                <p style="color: #047857; margin: 0; font-size: 14px;">Your appointment has been confirmed by your doctor.</p>
              </div>

              <div style="margin-bottom: 25px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                  Dear ${patientName},
                </p>
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                  We are pleased to inform you that your appointment has been accepted by <strong>${doctorName}</strong>.
                </p>
              </div>

              <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Appointment Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Patient Name:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${patientName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Doctor:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${doctorName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Specialization:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${appointment.doctor.specialization}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${appointmentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${appointmentTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${appointment.type || 'Consultation'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
                    <td style="padding: 8px 0;">
                      <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">Confirmed</span>
                    </td>
                  </tr>
                </table>
              </div>

              ${appointment.notes ? `
              <div style="margin-bottom: 25px;">
                <h3 style="color: #111827; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Notes:</h3>
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding: 12px; background-color: #f9fafb; border-radius: 4px;">
                  ${appointment.notes}
                </p>
              </div>
              ` : ''}

              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>Important:</strong> Please arrive 15 minutes before your scheduled appointment time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
                </p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                  If you have any questions or concerns, please don't hesitate to contact us:
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
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Appointment acceptance email sent to ${patientEmail} for appointment ${id}`);
      } catch (emailError) {
        console.error('❌ Error sending appointment acceptance email:', emailError);
        // Don't fail the request if email fails, just log the error
      }

      console.log(`✅ Appointment ${id} accepted by Dr. Okonkwo Doctor`);
      console.log(`   Patient: ${patientName} (${patientEmail})`);
      console.log(`   Date: ${appointmentDate} at ${appointmentTime}`);

      return res.json({
        success: true,
        message: 'Appointment accepted successfully. Patient has been notified via email.',
        data: updatedAppointment,
      });
    } catch (error) {
      console.error('❌ Error accepting appointment:', error);
      
      // Handle Prisma errors
      if (error.code === 'P2025') {
        // Record not found
        return res.status(404).json({ 
          error: 'Appointment not found',
          message: 'The appointment you are trying to accept does not exist or has been deleted.'
        });
      }
      
      if (error.code === 'P2002') {
        // Unique constraint violation
        return res.status(409).json({ 
          error: 'Conflict',
          message: 'This appointment cannot be accepted due to a conflict. Please refresh and try again.'
        });
      }
      
      // Handle database connection errors
      if (error.code === 'P1001' || error.message?.includes('connect')) {
        return res.status(503).json({ 
          error: 'Service unavailable',
          message: 'Database connection error. Please try again in a few moments.'
        });
      }
      
      // Generic server error with more details in development
      return res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An error occurred while accepting the appointment. Please try again or contact support.'
      });
    }
  },

  // Get all appointments for a doctor
  getAllAppointments: async (req, res) => {
    try {
      const { status, startDate, endDate, doctorId } = req.query;

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

      // Build where clause
      const where = { doctorId: doctor.id };
      if (status) where.status = status;
      
      // Add date range filter if provided
      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          where.date.gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          where.date.lte = end;
        }
      }

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
          { date: 'asc' }, // Oldest first for calendar view
          { time: 'asc' },
        ],
      });

      console.log(`✅ Fetched ${appointments.length} appointments for doctor ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.id})`);

      return res.json({ data: appointments });
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = doctorController;

