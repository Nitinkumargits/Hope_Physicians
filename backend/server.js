
// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

// Import routes
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const patientFormRoutes = require('./routes/patientFormRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');

// Staff dashboard routes
const receptionRoutes = require('./routes/staff/receptionRoutes');
const nurseRoutes = require('./routes/staff/nurseRoutes');
const labRoutes = require('./routes/staff/labRoutes');
const pharmacyRoutes = require('./routes/staff/pharmacyRoutes');
const staffManagementRoutes = require('./routes/admin/staffManagementRoutes');
const kycRoutes = require('./routes/admin/kycRoutes');
const adminGeneralRoutes = require('./routes/admin/adminRoutes');

// Patient dashboard routes
const patientAppointmentRoutes = require('./routes/patient/appointmentRoutes');
const patientPrescriptionRoutes = require('./routes/patient/prescriptionRoutes');
const patientReportRoutes = require('./routes/patient/reportRoutes');
const patientBillingRoutes = require('./routes/patient/billingRoutes');
const patientPaymentRoutes = require('./routes/patient/paymentRoutes');
const patientInsuranceRoutes = require('./routes/patient/insuranceRoutes');
const patientReminderRoutes = require('./routes/patient/reminderRoutes');
const patientChatRoutes = require('./routes/patient/chatRoutes');
const patientAdmissionRoutes = require('./routes/patient/admissionRoutes');
const patientFeedbackRoutes = require('./routes/patient/feedbackRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/patient-forms', patientFormRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// Staff dashboard routes
app.use('/api/staff/reception', receptionRoutes);
app.use('/api/staff/nurse', nurseRoutes);
app.use('/api/staff/lab', labRoutes);
app.use('/api/staff/pharmacy', pharmacyRoutes);
app.use('/api/admin/staff', staffManagementRoutes);
app.use('/api/admin/kyc', kycRoutes);
app.use('/api/admin', adminGeneralRoutes);

// Patient dashboard routes
app.use('/api/patient/appointments', patientAppointmentRoutes);
app.use('/api/patient/prescriptions', patientPrescriptionRoutes);
app.use('/api/patient/reports', patientReportRoutes);
app.use('/api/patient/billing', patientBillingRoutes);
app.use('/api/patient/payments', patientPaymentRoutes);
app.use('/api/patient/insurance', patientInsuranceRoutes);
app.use('/api/patient/reminders', patientReminderRoutes);
app.use('/api/patient/chat', patientChatRoutes);
app.use('/api/patient/admission', patientAdmissionRoutes);
app.use('/api/patient/feedback', patientFeedbackRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('HOPE PHYSICIAN API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
