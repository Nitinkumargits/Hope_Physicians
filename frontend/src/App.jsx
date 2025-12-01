
import { Routes, Route } from "react-router-dom";
import './styles/Layout.css';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Portal from "./pages/Portal";
import Appointment from "./pages/Appointment";
import ForgotPassword from "./pages/portal/ForgotPassword";
import ResetPassword from "./pages/portal/ResetPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import KYCReview from "./pages/admin/KYCReview";
import AdminPatients from "./pages/admin/Patients";
import AdminDoctors from "./pages/admin/Doctors";
import AdminAppointments from "./pages/admin/Appointments";
import Attendance from "./pages/admin/Attendance";
import Reports from "./pages/admin/Reports";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import PatientProfile from "./pages/doctor/PatientProfile";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import KYCDocuments from "./pages/patient/KYCDocuments";

// Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import Tasks from "./pages/staff/Tasks";
import StaffAttendance from "./pages/staff/Attendance";
import KYCAssistance from "./pages/staff/KYCAssistance";
import StaffAppointments from "./pages/staff/Appointments";
import StaffNotifications from "./pages/staff/Notifications";
// Import Service Pages
import FamilyMedicine from './pages/services/FamilyMedicine';
import PediatricCare from './pages/services/PediatricCare';
import MensHealth from './pages/services/MensHealth';
import WomensHealth from './pages/services/WomensHealth';
import OccupationalHealth from './pages/services/OccupationalHealth';
import GeriatricCare from './pages/services/GeriatricCare';

// Import Resource Pages
import PatientForm from './pages/resources/PatientForm';
import InsuranceInquiry from './pages/resources/InsuranceInquiry';
import PaymentPolicy from './pages/resources/PaymentPolicy';
import Insurance from './pages/resources/Insurance';
import LocalResources from './pages/resources/LocalResources';
import JobsCareers from './pages/resources/JobsCareers';
import FAQs from './pages/resources/FAQs';


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="departments" element={<Departments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="contact" element={<Contact />} />
        <Route path="portal" element={<Portal />} />
        <Route path="portal/login" element={<Portal />} />
        <Route path="portal/forgot-password" element={<ForgotPassword />} />
        <Route path="portal/reset-password" element={<ResetPassword />} />
        <Route path="appointment" element={<Appointment />} />
          
           {/* Services Routes */}
          <Route path="/family-medicine" element={<FamilyMedicine />} />
          <Route path="/pediatric-care" element={<PediatricCare />} />
          <Route path="/mens-health" element={<MensHealth />} />
          <Route path="/womens-health" element={<WomensHealth />} />
          <Route path="/occupational-health" element={<OccupationalHealth />} />
          <Route path="/geriatric-care" element={<GeriatricCare />} />
        
          {/* Resources Routes */}
          <Route path="/patient-form" element={<PatientForm />} />
          <Route path="/insurance-inquiry" element={<InsuranceInquiry />} />
          <Route path="/payment-policy" element={<PaymentPolicy />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/local-resources" element={<LocalResources />} />
          <Route path="/jobs-careers" element={<JobsCareers />} />
          <Route path="/faqs" element={<FAQs />} />
      </Route>

      {/* Protected Portal Routes */}
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/employees" element={<Employees />} />
      <Route path="/admin/patients" element={<AdminPatients />} />
      <Route path="/admin/doctors" element={<AdminDoctors />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/admin/kyc-review" element={<KYCReview />} />
      <Route path="/admin/attendance" element={<Attendance />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/notifications" element={<Notifications />} />
      <Route path="/admin/settings" element={<Settings />} />

      {/* Doctor Routes */}
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/patients" element={<DoctorDashboard />} />
      <Route path="/doctor/patients/:id" element={<PatientProfile />} />
      <Route path="/doctor/calendar" element={<DoctorDashboard />} />
      <Route path="/doctor/prescriptions" element={<DoctorDashboard />} />
      <Route path="/doctor/notifications" element={<DoctorDashboard />} />

      {/* Patient Routes */}
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/patient/appointments" element={<PatientDashboard />} />
      <Route path="/patient/book-appointment" element={<BookAppointment />} />
      <Route path="/patient/profile" element={<PatientDashboard />} />
      <Route path="/patient/kyc-documents" element={<KYCDocuments />} />
      <Route path="/patient/notifications" element={<PatientDashboard />} />

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/staff/tasks" element={<Tasks />} />
      <Route path="/staff/attendance" element={<StaffAttendance />} />
      <Route path="/staff/kyc-assistance" element={<KYCAssistance />} />
      <Route path="/staff/appointments" element={<StaffAppointments />} />
      <Route path="/staff/notifications" element={<StaffNotifications />} />
    </Routes>
  );
}

export default App;
