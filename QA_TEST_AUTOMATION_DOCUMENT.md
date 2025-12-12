# 🧪 Hospital Management System - QA/Test Automation Document

## Table of Contents

1. [Test Login Credentials](#part-a-test-login-credentials)
2. [System End-to-End Workflows](#part-b-system-end-to-end-workflows)
3. [Validation Checklist](#part-c-validation-checklist)
4. [Test Scenarios](#part-d-test-scenarios)
5. [Dummy Test Data / Seeding](#part-e-dummy-test-data-seeding)
6. [Patient Information Form Test Data](#part-f--patient-information-form-test-data)

---

## PART A – Test Login Credentials

### Test User Credentials Table

| Role          | Email                         | Password      | Employee ID | Permissions                                                                   | Status |
| ------------- | ----------------------------- | ------------- | ----------- | ----------------------------------------------------------------------------- | ------ |
| **Admin**     | admin@hopephysicians.com      | Admin@123     | ADM001      | Full system access, all CRUD operations                                       | Active |
| **Doctor**    | dr.smith@hopephysicians.com   | Doctor@123    | DOC001      | View appointments, write prescriptions, view patients, manage medical records | Active |
| **Doctor**    | dr.johnson@hopephysicians.com | Doctor@123    | DOC002      | Same as above                                                                 | Active |
| **Reception** | reception@hopephysicians.com  | Reception@123 | REC001      | Patient registration, appointment management, billing, invoice generation     | Active |
| **Nurse**     | nurse.mary@hopephysicians.com | Nurse@123     | NUR001      | Record vitals, medication management, bed allocation, emergency alerts        | Active |
| **Lab Staff** | lab.tech@hopephysicians.com   | Lab@123       | LAB001      | Lab test management, report upload, test status updates                       | Active |
| **Pharmacy**  | pharmacy@hopephysicians.com   | Pharmacy@123  | PHM001      | Stock management, prescription orders, expiry alerts                          | Active |
| **Patient**   | patient.john@example.com      | Patient@123   | -           | View appointments, prescriptions, reports, billing, chat                      | Active |
| **Patient**   | patient.sarah@example.com     | Patient@123   | -           | Same as above                                                                 | Active |
| **Patient**   | patient.mike@example.com      | Patient@123   | -           | Same as above                                                                 | Active |

### Role Permissions Matrix

| Feature                | Admin | Doctor | Reception | Nurse | Lab | Pharmacy | Patient  |
| ---------------------- | ----- | ------ | --------- | ----- | --- | -------- | -------- |
| Patient Registration   | ✅    | ❌     | ✅        | ❌    | ❌  | ❌       | ❌       |
| Appointment Management | ✅    | ✅     | ✅        | ❌    | ❌  | ❌       | ✅ (own) |
| Prescription Creation  | ✅    | ✅     | ❌        | ❌    | ❌  | ❌       | ❌       |
| Vitals Entry           | ✅    | ✅     | ❌        | ✅    | ❌  | ❌       | ❌       |
| Bed Allocation         | ✅    | ❌     | ❌        | ✅    | ❌  | ❌       | ❌       |
| Lab Test Management    | ✅    | ✅     | ❌        | ❌    | ✅  | ❌       | ❌       |
| Pharmacy Stock         | ✅    | ❌     | ❌        | ❌    | ❌  | ✅       | ❌       |
| Billing & Invoices     | ✅    | ❌     | ✅        | ❌    | ❌  | ❌       | ✅ (own) |
| Staff Management       | ✅    | ❌     | ❌        | ❌    | ❌  | ❌       | ❌       |
| View Own Data          | ✅    | ✅     | ❌        | ❌    | ❌  | ❌       | ✅       |

---

## PART B – System End-to-End Workflows

### 🧑‍⚕️ PATIENT WORKFLOW

#### 1. Patient Registration & Login

**Steps:**

1. Navigate to patient registration page
2. Fill form: First Name, Last Name, Email, Phone, DOB, Gender, Address
3. Add Emergency Contact details
4. Add Insurance Information (optional)
5. Submit registration
6. Receive confirmation email
7. Login with email/password

**Expected Result:**

- Patient record created in database
- PortalUser created with role='patient'
- Confirmation email sent
- Redirected to Patient Dashboard

**Validation:**

- ✅ Email uniqueness check
- ✅ Phone number format validation
- ✅ Required fields validation
- ✅ Password strength check

---

#### 2. Book Appointment Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Book Appointment"
3. View available doctors list
4. Select doctor (e.g., Dr. Smith - Cardiology)
5. Select date (future date)
6. View available time slots for selected date
7. Select time slot (e.g., 10:00 AM)
8. Select appointment type (Consultation/Follow-up)
9. Add notes (optional)
10. Confirm booking
11. Receive confirmation notification

**Expected Result:**

- Appointment created with status='scheduled'
- Appointment visible in patient's appointment list
- Doctor's calendar updated
- Confirmation email/SMS sent
- Reminder scheduled for 24h before

**Validation:**

- ✅ Doctor availability check
- ✅ Time slot conflict prevention
- ✅ Date must be future date
- ✅ Patient can only book for themselves

---

#### 3. Cancel Appointment Workflow

**Steps:**

1. Login as Patient
2. Navigate to "My Appointments"
3. Find scheduled appointment
4. Click "Cancel" button
5. Enter cancellation reason (optional)
6. Confirm cancellation
7. Receive cancellation confirmation

**Expected Result:**

- Appointment status changed to 'cancelled'
- Time slot becomes available for other patients
- Cancellation email sent
- Appointment removed from upcoming list
- Cancelled appointments visible in history

**Validation:**

- ✅ Can only cancel own appointments
- ✅ Cannot cancel completed appointments
- ✅ Cannot cancel appointments less than 2 hours before
- ✅ Cancellation reason optional

---

#### 4. Reschedule Appointment Workflow

**Steps:**

1. Login as Patient
2. Navigate to "My Appointments"
3. Find scheduled appointment
4. Click "Reschedule"
5. Select new date
6. View available slots for new date
7. Select new time slot
8. Enter rescheduling reason
9. Confirm reschedule

**Expected Result:**

- Appointment date/time updated
- Status changed to 'rescheduled'
- Old time slot freed
- New time slot reserved
- Rescheduling notification sent
- Appointment visible with updated date/time

**Validation:**

- ✅ New date must be future date
- ✅ New time slot must be available
- ✅ Cannot reschedule to same date/time
- ✅ Rescheduling reason optional

---

#### 5. View Prescription Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Prescriptions"
3. View list of all prescriptions
4. Click on prescription to view details
5. View medications list with dosage
6. View doctor notes and instructions
7. Download PDF (if available)

**Expected Result:**

- All prescriptions displayed chronologically
- Prescription details show:
  - Doctor name and specialization
  - Issue date
  - Medications with dosage, frequency, duration
  - Instructions
  - Diagnosis (if any)
- PDF download works

**Validation:**

- ✅ Can only view own prescriptions
- ✅ Prescriptions sorted by date (newest first)
- ✅ PDF generation works correctly
- ✅ Medication details formatted correctly

---

#### 6. View Reports Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Reports"
3. Switch between "Medical Reports" and "Lab Reports" tabs
4. View report list
5. Click on report to view details
6. View test results/data
7. Download PDF report (if available)

**Expected Result:**

- Reports displayed with date, type, doctor
- Report details show:
  - Report title and type
  - Test results/data
  - Doctor notes
  - Attachments/files
- PDF download works
- Lab reports show test name, results, normal ranges

**Validation:**

- ✅ Can only view own reports
- ✅ Reports sorted by date
- ✅ PDF download functional
- ✅ File attachments accessible

---

#### 7. Medication Reminders Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Reminders"
3. View active reminders list
4. Create new reminder:
   - Select reminder type (Medication/Appointment)
   - Enter title and description
   - Set date and time
   - Select notification method (App/Email/SMS)
   - Set recurrence (if needed)
5. Save reminder
6. Receive reminder at scheduled time

**Expected Result:**

- Reminder created successfully
- Reminder appears in list
- Notification sent at scheduled time
- Recurring reminders work correctly
- Can edit/delete reminders

**Validation:**

- ✅ Reminder time must be future
- ✅ Notification methods work
- ✅ Recurring reminders create next instance
- ✅ Can mark reminder as completed

---

#### 8. Billing & Payment Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Billing"
3. View bills list (Bills tab)
4. Click on bill to view details
5. View invoice items, subtotal, tax, total
6. Click "Pay Now" for unpaid bill
7. Redirected to payment gateway (Razorpay)
8. Enter payment details
9. Complete payment
10. Payment verified
11. Redirected back to billing page
12. View payment history (History tab)

**Expected Result:**

- Bills displayed with status (paid/unpaid/partial)
- Invoice details correct
- Payment gateway opens correctly
- Payment processed successfully
- Bill status updated to 'paid'
- Payment transaction recorded
- Payment appears in history
- Receipt generated

**Validation:**

- ✅ Can only view own bills
- ✅ Payment amount matches bill balance
- ✅ Payment verification works
- ✅ Payment history accurate
- ✅ Receipt generation works

---

#### 9. Upload Insurance Documents Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Insurance"
3. Click "Upload Document"
4. Select document type (Insurance Card/Policy Document)
5. Choose file (PDF/JPG/PNG, max 5MB)
6. Add description (optional)
7. Upload file
8. View uploaded documents list

**Expected Result:**

- File uploaded successfully
- File visible in documents list
- File accessible for download
- File type and size validated
- Can delete uploaded files

**Validation:**

- ✅ File size limit enforced (5MB)
- ✅ File type validation (PDF/JPG/PNG only)
- ✅ Can upload multiple documents
- ✅ Can delete own documents
- ✅ File storage secure

---

#### 10. Chat with Support Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Chat Support"
3. View chat interface
4. Type message
5. Send message
6. Receive response from support agent
7. Continue conversation
8. View chat history

**Expected Result:**

- Chat interface loads
- Messages sent successfully
- Real-time message delivery (WebSocket)
- Support agent responds
- Chat history preserved
- Unread message count updates

**Validation:**

- ✅ Messages sent instantly
- ✅ Real-time updates work
- ✅ Chat history loads correctly
- ✅ Unread count accurate
- ✅ Support agents available

---

#### 11. Emergency Call Feature Workflow

**Steps:**

1. Login as Patient
2. Click "Emergency SOS" button (floating button)
3. Emergency modal opens
4. Select emergency type (Medical/Cardiac/Respiratory)
5. Select severity (Critical/High/Medium)
6. Enter location (Room/Bed number)
7. Enter description
8. Click "Trigger Emergency Alert"
9. Alert sent to hospital staff

**Expected Result:**

- Emergency alert created
- Alert visible to nurses/doctors
- Notification sent to relevant staff
- Alert status tracked
- Patient can see alert status

**Validation:**

- ✅ Alert triggers immediately
- ✅ Staff notified instantly
- ✅ Alert severity displayed correctly
- ✅ Location information captured
- ✅ Alert can be acknowledged/resolved

---

#### 12. Admission Status Tracking Workflow

**Steps:**

1. Login as Patient
2. Navigate to "Admission"
3. View current admission status (if admitted)
4. View room number, bed number, floor
5. View admission date and expected discharge
6. View admission history
7. Track status updates

**Expected Result:**

- Current admission status displayed
- Room/bed details shown
- Admission history listed
- Status updates visible
- Discharge information shown when discharged

**Validation:**

- ✅ Only shows own admission
- ✅ Status updates in real-time
- ✅ History accurate
- ✅ Discharge date displayed correctly

---

#### 13. Feedback Submission Workflow

**Steps:**

1. Login as Patient
2. After appointment completion, click "Submit Feedback"
3. Select feedback type (Doctor/Hospital/Service)
4. Rate overall experience (1-5 stars)
5. Rate specific categories (Cleanliness, Staff Behavior, Wait Time)
6. Add comments
7. Submit feedback
8. View submitted feedback

**Expected Result:**

- Feedback submitted successfully
- Ratings saved correctly
- Comments stored
- Feedback visible in list
- Can update feedback (if allowed)

**Validation:**

- ✅ Ratings required (1-5 stars)
- ✅ Comments optional
- ✅ Feedback linked to appointment/doctor
- ✅ Feedback visible to admin
- ✅ Can submit multiple feedbacks

---

### 🩺 DOCTOR WORKFLOW

#### 1. Doctor Login & Dashboard Access

**Steps:**

1. Navigate to login page
2. Enter doctor credentials (dr.smith@hopephysicians.com / Doctor@123)
3. Click "Login"
4. Redirected to Doctor Dashboard
5. Verify dashboard loads with correct data

**Expected Result:**

- Login successful
- Dashboard displays:
  - Today's appointments count
  - Upcoming appointments
  - Patient queue
  - Revenue summary
  - Recent prescriptions
- Role-based menu visible

**Validation:**

- ✅ Correct role assigned
- ✅ Dashboard data accurate
- ✅ Only doctor features visible
- ✅ Session maintained

---

#### 2. View Today/Upcoming Appointments

**Steps:**

1. Login as Doctor
2. Navigate to "Appointments"
3. Filter by "Today" or "Upcoming"
4. View appointment list
5. Click on appointment to view details

**Expected Result:**

- Today's appointments displayed
- Upcoming appointments listed
- Appointment details show:
  - Patient name and info
  - Appointment time
  - Type and status
  - Patient medical history link
- Appointments sorted by time

**Validation:**

- ✅ Only shows doctor's appointments
- ✅ Today's appointments highlighted
- ✅ Time sorting correct
- ✅ Patient details accessible

---

#### 3. Accept/Reject/Reschedule Appointment

**Steps:**

1. Login as Doctor
2. View pending appointment request
3. Click "Accept" or "Reject"
4. If accepting: Appointment status → 'confirmed'
5. If rejecting: Enter rejection reason
6. If rescheduling: Select new date/time, confirm

**Expected Result:**

- Appointment accepted → Status='confirmed', Patient notified
- Appointment rejected → Status='rejected', Patient notified with reason
- Appointment rescheduled → Date/time updated, Patient notified

**Validation:**

- ✅ Status updates correctly
- ✅ Patient notifications sent
- ✅ Calendar updated
- ✅ Rejection reason saved

---

#### 4. View Patient Medical History

**Steps:**

1. Login as Doctor
2. Click on patient from appointment list
3. View patient profile
4. Navigate to "Medical History"
5. View:
   - Past appointments
   - Previous prescriptions
   - Medical records
   - Lab reports
   - Vitals history

**Expected Result:**

- Complete medical history displayed
- Chronological order
- All records accessible
- Can filter by type/date
- Can view detailed records

**Validation:**

- ✅ All history visible
- ✅ Records sorted correctly
- ✅ Details accurate
- ✅ Can navigate between records

---

#### 5. Write Prescription & Diagnosis Notes

**Steps:**

1. Login as Doctor
2. Open appointment (in_progress)
3. Navigate to "Prescription"
4. Add diagnosis
5. Add medications:
   - Medication name
   - Dosage
   - Frequency
   - Duration
   - Instructions
6. Add general instructions
7. Add notes
8. Save prescription
9. Generate PDF (optional)

**Expected Result:**

- Prescription created successfully
- Medications saved correctly
- Diagnosis recorded
- Prescription visible to patient
- PDF generated (if requested)
- Prescription linked to appointment

**Validation:**

- ✅ All fields saved correctly
- ✅ Medications formatted properly
- ✅ PDF generation works
- ✅ Patient can view prescription
- ✅ Prescription status='active'

---

#### 6. Upload Lab Reports/Images

**Steps:**

1. Login as Doctor
2. Navigate to patient's medical records
3. Click "Add Medical Record"
4. Select record type (Lab Result/Test Result/Report)
5. Enter title and description
6. Upload file (PDF/Image)
7. Add test results (if lab report)
8. Mark abnormal/critical flags
9. Save record

**Expected Result:**

- Medical record created
- File uploaded successfully
- Record visible in patient history
- Patient can view/download
- Test results formatted correctly

**Validation:**

- ✅ File upload works
- ✅ File type validated
- ✅ Record linked to patient/appointment
- ✅ Patient notified of new report
- ✅ File accessible

---

#### 7. Create Follow-up Appointment

**Steps:**

1. Login as Doctor
2. After completing appointment
3. Click "Schedule Follow-up"
4. Select follow-up date (recommended date shown)
5. Select time slot
6. Add reason for follow-up
7. Set priority (Normal/High/Urgent)
8. Save follow-up
9. Patient notified

**Expected Result:**

- Follow-up appointment created
- Linked to original appointment
- Patient notified
- Appears in both doctor and patient calendars
- Reminder scheduled

**Validation:**

- ✅ Follow-up linked correctly
- ✅ Patient notification sent
- ✅ Calendar updated
- ✅ Priority set correctly

---

#### 8. Tele-Consultation Join Flow

**Steps:**

1. Login as Doctor
2. View tele-consultation appointment
3. Click "Join Consultation"
4. WebRTC connection established
5. Video/audio call starts
6. Patient joins
7. Conduct consultation
8. End call
9. Consultation notes saved

**Expected Result:**

- Video call connects successfully
- Audio/video quality good
- Call duration recorded
- Consultation notes saved
- Appointment status='completed'

**Validation:**

- ✅ WebRTC connection works
- ✅ Audio/video functional
- ✅ Call recording (if enabled)
- ✅ Notes saved correctly

---

#### 9. Analytics Testing

**Steps:**

1. Login as Doctor
2. Navigate to "Analytics" or "Dashboard"
3. View statistics:
   - Total patients
   - Appointments (today/week/month)
   - Revenue summary
   - Prescriptions issued
   - Follow-ups scheduled
4. View charts/graphs
5. Filter by date range

**Expected Result:**

- Statistics accurate
- Charts display correctly
- Data filters work
- Summary cards show correct numbers
- Trends visible

**Validation:**

- ✅ Data accuracy verified
- ✅ Charts render correctly
- ✅ Date filters work
- ✅ Calculations correct
- ✅ Real-time updates

---

### 🏥 STAFF WORKFLOW

#### RECEPTION WORKFLOW

##### 1. Register New Patient

**Steps:**

1. Login as Reception staff
2. Navigate to "Patient Registration"
3. Fill patient form:
   - Personal Information (Name, DOB, Gender, Contact)
   - Address details
   - Emergency contact
   - Insurance information
4. Submit form
5. Patient record created
6. Generate patient ID

**Expected Result:**

- Patient registered successfully
- Patient ID generated
- Record saved in database
- PortalUser created (if email provided)
- Confirmation shown

**Validation:**

- ✅ Email uniqueness check
- ✅ Required fields validated
- ✅ Patient ID format correct
- ✅ Record visible in patient list

---

##### 2. Create & Assign Appointment to Doctor

**Steps:**

1. Login as Reception
2. Navigate to "Appointments" → "Create Appointment"
3. Select patient (search by name/email/phone)
4. Select doctor from available list
5. Select date
6. View available time slots
7. Select time slot
8. Select appointment type
9. Add notes
10. Assign appointment
11. Confirm creation

**Expected Result:**

- Appointment created
- Assigned to selected doctor
- Status='scheduled'
- Patient notified
- Doctor's calendar updated
- Appointment visible in list

**Validation:**

- ✅ Doctor availability checked
- ✅ Time slot conflict prevented
- ✅ Patient selection works
- ✅ Notifications sent

---

##### 3. Manage Appointment Schedule

**Steps:**

1. Login as Reception
2. Navigate to "Appointments"
3. View all appointments (filter by date/doctor/status)
4. Edit appointment:
   - Change date/time
   - Change doctor
   - Update status
   - Add notes
5. Cancel appointment (if needed)
6. Reschedule appointment

**Expected Result:**

- Appointments list displayed
- Filters work correctly
- Edit functionality works
- Changes saved
- Notifications sent
- Calendar updated

**Validation:**

- ✅ All appointments visible
- ✅ Filters accurate
- ✅ Edit saves correctly
- ✅ Notifications sent
- ✅ Calendar syncs

---

##### 4. Generate Invoice

**Steps:**

1. Login as Reception
2. Navigate to "Billing" → "Create Invoice"
3. Select patient
4. Link to appointment (optional)
5. Add billing items:
   - Description
   - Quantity
   - Unit price
   - Calculate total
6. Add tax (if applicable)
7. Add discount (if applicable)
8. Calculate final total
9. Set due date
10. Generate invoice
11. Invoice number auto-generated

**Expected Result:**

- Invoice created successfully
- Invoice number generated (INV-YYYY-MMDD-XXXX)
- Items saved correctly
- Calculations accurate
- PDF generated (optional)
- Invoice visible in billing list

**Validation:**

- ✅ Invoice number unique
- ✅ Calculations correct
- ✅ Items saved properly
- ✅ PDF generation works
- ✅ Patient can view invoice

---

##### 5. Update Payment Status

**Steps:**

1. Login as Reception
2. Navigate to "Billing"
3. Find invoice
4. Click "Update Payment"
5. Select payment status (Unpaid/Partial/Paid)
6. Enter paid amount
7. Select payment method (Cash/Card/Online/Insurance)
8. Add payment notes
9. Save payment update

**Expected Result:**

- Payment status updated
- Paid amount recorded
- Payment method saved
- Payment date recorded
- Invoice status updated
- Payment transaction created

**Validation:**

- ✅ Status updates correctly
- ✅ Amount validation
- ✅ Payment method saved
- ✅ Transaction recorded
- ✅ Invoice balance updated

---

#### NURSE WORKFLOW

##### 1. Add/Update Patient Vitals

**Steps:**

1. Login as Nurse
2. Navigate to "Vitals" → "Record Vitals"
3. Select patient (search or from admitted list)
4. Enter vitals:
   - Blood Pressure (Systolic/Diastolic)
   - Pulse (bpm)
   - Temperature (°C/°F)
   - Respiratory Rate
   - SpO2 (%)
   - Blood Sugar (mg/dL)
   - Weight & Height (BMI calculated)
   - Pain Level (0-10)
   - Consciousness level
5. Add notes
6. Save vitals

**Expected Result:**

- Vitals recorded successfully
- BMI calculated automatically
- Vitals visible in patient history
- Latest vitals shown on patient card
- Vitals chart/graph updated

**Validation:**

- ✅ All vitals saved correctly
- ✅ BMI calculation accurate
- ✅ Vitals history maintained
- ✅ Charts update correctly
- ✅ Can view vitals trends

---

##### 2. Medication Schedule Updates

**Steps:**

1. Login as Nurse
2. Navigate to "Medication" → "Medication Schedule"
3. View patient's medication list
4. Add new medication:
   - Medication name
   - Dosage
   - Frequency
   - Route (Oral/IV/IM)
   - Start date
   - End date
   - Specific times
5. Mark medication as administered:
   - Select medication
   - Click "Mark Administered"
   - Add notes
   - Next dose time calculated
6. Update medication status

**Expected Result:**

- Medication schedule created
- Schedule visible in list
- Administered medications marked
- Next dose time calculated
- Schedule updated correctly
- Reminders created

**Validation:**

- ✅ Schedule saved correctly
- ✅ Times calculated properly
- ✅ Administered status updates
- ✅ Next dose time accurate
- ✅ Reminders work

---

##### 3. Bed/Room Allocation Workflow

**Steps:**

1. Login as Nurse
2. Navigate to "Bed Allocation"
3. View available beds
4. Allocate bed:
   - Select patient
   - Select room number
   - Select bed number
   - Select room type (General/Private/ICU)
   - Enter floor
   - Set expected discharge date
   - Add notes
5. Confirm allocation
6. Release bed (when patient discharged):
   - Select bed allocation
   - Click "Release Bed"
   - Add discharge notes
   - Confirm release

**Expected Result:**

- Bed allocated successfully
- Bed status='occupied'
- Patient linked to bed
- Room status updated
- Bed visible in occupied list
- Bed released → Status='available'

**Validation:**

- ✅ Bed availability checked
- ✅ Room type validation
- ✅ Bed status updates
- ✅ Patient linked correctly
- ✅ Release works correctly

---

##### 4. Emergency Alert System Test

**Steps:**

1. Login as Nurse
2. Navigate to "Emergency Alerts" or use SOS button
3. Trigger emergency alert:
   - Select patient (optional)
   - Select alert type (Medical/Cardiac/Respiratory/Fall)
   - Select severity (Low/Medium/High/Critical)
   - Enter location
   - Enter description
4. Submit alert
5. Alert appears in system
6. Acknowledge alert:
   - Click "Acknowledge"
   - Alert status='acknowledged'
7. Resolve alert:
   - Add response notes
   - Click "Resolve"
   - Alert status='resolved'

**Expected Result:**

- Alert created immediately
- Alert visible to all staff
- Notifications sent
- Alert can be acknowledged
- Alert can be resolved
- Alert history maintained

**Validation:**

- ✅ Alert triggers instantly
- ✅ Notifications sent
- ✅ Alert visible to relevant staff
- ✅ Acknowledge works
- ✅ Resolve works
- ✅ History maintained

---

#### LAB WORKFLOW

##### 1. Lab Test Request Creation

**Steps:**

1. Login as Lab Staff
2. Navigate to "Lab Tests" → "Create Test Request"
3. View pending test requests
4. Assign test to technician:
   - Select test
   - Click "Assign"
   - Select technician
   - Confirm assignment
5. Test status='assigned'

**Expected Result:**

- Test requests visible
- Can assign to technician
- Status updates correctly
- Technician notified
- Test appears in technician's list

**Validation:**

- ✅ Requests displayed correctly
- ✅ Assignment works
- ✅ Status updates
- ✅ Notifications sent

---

##### 2. Upload Lab Results

**Steps:**

1. Login as Lab Staff
2. Navigate to assigned test
3. Click "Upload Report"
4. Enter test results (JSON or form)
5. Set normal ranges
6. Mark abnormal/critical flags
7. Upload report file (PDF/Image)
8. Add lab notes
9. Mark status='completed'
10. Save report

**Expected Result:**

- Report uploaded successfully
- Results saved correctly
- Report file accessible
- Test status='completed'
- Doctor notified
- Patient can view report

**Validation:**

- ✅ File upload works
- ✅ Results saved correctly
- ✅ Status updates
- ✅ Notifications sent
- ✅ Patient access works

---

##### 3. Update Test Status

**Steps:**

1. Login as Lab Staff
2. View test list
3. Update status:
   - Pending → Assigned
   - Assigned → In Progress
   - In Progress → Completed
4. Status updates
5. Notifications sent

**Expected Result:**

- Status updates correctly
- Workflow enforced (cannot skip steps)
- Notifications sent at each stage
- Status history maintained

**Validation:**

- ✅ Status workflow enforced
- ✅ Updates save correctly
- ✅ Notifications sent
- ✅ History maintained

---

#### PHARMACY WORKFLOW

##### 1. Medicine Stock Add/Update

**Steps:**

1. Login as Pharmacy Staff
2. Navigate to "Stock Management"
3. Add new medicine:
   - Medicine name
   - Generic name
   - Brand name
   - Quantity
   - Unit (Unit/Box/Bottle/Strip)
   - Unit price
   - Category
   - Manufacturer
   - Batch number
   - Expiry date
   - Shelf location
4. Update existing stock:
   - Find medicine
   - Update quantity
   - Update price
   - Update expiry
5. Save changes

**Expected Result:**

- Medicine added successfully
- Stock updated correctly
- Status calculated (Available/Low Stock/Out of Stock)
- Expiry alerts generated
- Stock visible in list

**Validation:**

- ✅ Medicine saved correctly
- ✅ Stock calculations accurate
- ✅ Status updates automatically
- ✅ Expiry alerts work
- ✅ Low stock alerts work

---

##### 2. Approve Prescription for Delivery

**Steps:**

1. Login as Pharmacy Staff
2. Navigate to "Prescription Orders"
3. View pending orders
4. Process order:
   - Click "Process"
   - Verify stock availability
   - Prepare medicines
   - Mark status='processing'
5. Mark ready:
   - Click "Mark Ready"
   - Status='ready'
6. Mark delivered:
   - Click "Mark Delivered"
   - Status='delivered'
   - Delivery date recorded

**Expected Result:**

- Orders visible in list
- Can process orders
- Status updates correctly
- Stock deducted when processed
- Patient notified at each stage

**Validation:**

- ✅ Orders displayed correctly
- ✅ Stock availability checked
- ✅ Status workflow enforced
- ✅ Stock deducted correctly
- ✅ Notifications sent

---

##### 3. Low Stock Alerts

**Steps:**

1. Login as Pharmacy Staff
2. View dashboard
3. Check "Low Stock" section
4. View medicines below reorder level
5. Click on medicine
6. Update stock or create purchase order

**Expected Result:**

- Low stock medicines highlighted
- Alert count displayed
- Can filter by low stock
- Can update stock
- Can create purchase orders

**Validation:**

- ✅ Low stock detection accurate
- ✅ Alerts displayed correctly
- ✅ Can take action
- ✅ Stock updates work

---

### 👨‍💼 ADMIN WORKFLOW

#### 1. Add/Update/Delete Staff & Doctors

**Steps:**

1. Login as Admin
2. Navigate to "Staff Management"
3. Add Staff:
   - Fill staff form (Name, Email, Phone, Designation, Department)
   - Assign role (Reception/Nurse/Lab/Pharmacy)
   - Set password
   - Generate Employee ID
4. Add Doctor:
   - Fill doctor form
   - Add specialization
   - Add license number
   - Set availability
5. Update Staff/Doctor:
   - Find staff member
   - Edit details
   - Update role/permissions
6. Delete Staff:
   - Find staff member
   - Click "Deactivate"
   - Confirm deactivation

**Expected Result:**

- Staff/Doctor added successfully
- Employee ID generated
- PortalUser created
- Can update details
- Can deactivate (soft delete)
- Changes saved

**Validation:**

- ✅ Email uniqueness
- ✅ Employee ID unique
- ✅ Role assignment works
- ✅ PortalUser created
- ✅ Deactivation works
- ✅ Cannot delete active users

---

#### 2. Assign Roles and Permissions

**Steps:**

1. Login as Admin
2. Navigate to "Role Permissions"
3. View role list
4. Edit role permissions:
   - Select role
   - Click "Edit Permissions"
   - Toggle permissions (Create/Read/Update/Delete) for each resource
   - Save permissions
5. Verify permissions applied

**Expected Result:**

- Roles displayed
- Permissions editable
- Changes saved
- Permissions enforced in system
- Users with role get new permissions

**Validation:**

- ✅ Permissions save correctly
- ✅ Enforced in middleware
- ✅ Role-based access works
- ✅ Changes apply immediately

---

#### 3. Manage Department List

**Steps:**

1. Login as Admin
2. Navigate to "Departments" or "Settings"
3. View department list
4. Add department:
   - Enter department name
   - Add description
   - Save
5. Edit department
6. Delete department (if no staff assigned)

**Expected Result:**

- Departments listed
- Can add/edit/delete
- Departments available in dropdowns
- Staff can be assigned to departments

**Validation:**

- ✅ Departments save correctly
- ✅ Available in forms
- ✅ Cannot delete if staff assigned
- ✅ Updates reflect everywhere

---

#### 4. Inventory Management (Medicine & Equipment)

**Steps:**

1. Login as Admin
2. Navigate to "Inventory"
3. View inventory items
4. Add Medicine:
   - Medicine details
   - Stock quantity
   - Pricing
   - Expiry tracking
5. Add Equipment:
   - Equipment name
   - Category
   - Serial number
   - Location
   - Status
   - Maintenance schedule
6. Update inventory
7. Track maintenance

**Expected Result:**

- Inventory items listed
- Can add medicines and equipment
- Stock tracking works
- Maintenance schedules tracked
- Status updates work

**Validation:**

- ✅ Items save correctly
- ✅ Stock tracking accurate
- ✅ Maintenance alerts work
- ✅ Status updates correctly

---

#### 5. Attendance & Shift Management

**Steps:**

1. Login as Admin
2. Navigate to "Attendance"
3. View attendance records
4. Filter by:
   - Employee
   - Date range
   - Status
5. View attendance statistics
6. Manage shifts:
   - Create shift schedules
   - Assign staff to shifts
   - View shift coverage

**Expected Result:**

- Attendance records displayed
- Filters work correctly
- Statistics accurate
- Shift management works
- Reports generated

**Validation:**

- ✅ Records accurate
- ✅ Filters work
- ✅ Statistics correct
- ✅ Shift assignment works
- ✅ Reports accurate

---

#### 6. System Settings & Audit Log Review

**Steps:**

1. Login as Admin
2. Navigate to "System Settings"
3. View/Edit settings:
   - Hospital information
   - Email/SMS configuration
   - Payment gateway settings
   - Notification settings
4. Navigate to "Audit Logs"
5. View system activity logs
6. Filter logs by:
   - User
   - Action
   - Date range
   - Module

**Expected Result:**

- Settings editable
- Changes saved
- Audit logs displayed
- Filters work
- Logs detailed and accurate

**Validation:**

- ✅ Settings save correctly
- ✅ Audit logs comprehensive
- ✅ Filters work
- ✅ Logs cannot be deleted
- ✅ Logs show all critical actions

---

## PART C – Validation Checklist

### Patient Module Validations

| Action                     | Expected System Behavior | UI Update                   | Success Message                   | Error Message                         | Database Changes                               |
| -------------------------- | ------------------------ | --------------------------- | --------------------------------- | ------------------------------------- | ---------------------------------------------- |
| **Register Patient**       | Patient record created   | Redirect to dashboard       | "Patient registered successfully" | "Email already exists"                | Patient + PortalUser records created           |
| **Book Appointment**       | Appointment created      | Appointment appears in list | "Appointment booked successfully" | "Doctor unavailable at this time"     | Appointment record created, status='scheduled' |
| **Cancel Appointment**     | Status → 'cancelled'     | Removed from upcoming       | "Appointment cancelled"           | "Cannot cancel completed appointment" | Status updated, time slot freed                |
| **Reschedule Appointment** | Date/time updated        | Appointment shows new date  | "Appointment rescheduled"         | "Time slot not available"             | Date/time updated, status='rescheduled'        |
| **View Prescription**      | Prescription displayed   | Prescription details shown  | -                                 | "Prescription not found"              | No changes                                     |
| **View Report**            | Report displayed         | Report details shown        | -                                 | "Report not found"                    | No changes                                     |
| **Download Report PDF**    | PDF downloaded           | Download starts             | "Download started"                | "PDF not available"                   | No changes                                     |
| **Create Reminder**        | Reminder created         | Reminder in list            | "Reminder created"                | "Invalid date/time"                   | Reminder record created                        |
| **Pay Bill**               | Payment processed        | Bill status='paid'          | "Payment successful"              | "Payment failed"                      | PaymentTransaction created, Billing updated    |
| **Upload Insurance**       | File uploaded            | File in list                | "File uploaded successfully"      | "Invalid file type/size"              | InsuranceFile record created                   |
| **Send Chat Message**      | Message sent             | Message appears             | "Message sent"                    | "Failed to send"                      | ChatMessage created                            |
| **Trigger Emergency**      | Alert created            | Alert visible               | "Emergency alert triggered"       | "Failed to trigger"                   | EmergencyAlert created                         |
| **Submit Feedback**        | Feedback saved           | Feedback in list            | "Feedback submitted"              | "Invalid rating"                      | Feedback record created                        |

### Doctor Module Validations

| Action                     | Expected System Behavior | UI Update             | Success Message        | Error Message             | Database Changes                      |
| -------------------------- | ------------------------ | --------------------- | ---------------------- | ------------------------- | ------------------------------------- |
| **Accept Appointment**     | Status → 'confirmed'     | Appointment confirmed | "Appointment accepted" | "Appointment not found"   | Status updated, Patient notified      |
| **Reject Appointment**     | Status → 'rejected'      | Appointment removed   | "Appointment rejected" | -                         | Status updated, reason saved          |
| **Write Prescription**     | Prescription created     | Prescription visible  | "Prescription created" | "Invalid medication data" | Prescription record created           |
| **Upload Report**          | Report uploaded          | Report in history     | "Report uploaded"      | "File upload failed"      | MedicalRecord created                 |
| **Create Follow-up**       | Follow-up scheduled      | Follow-up in list     | "Follow-up scheduled"  | "Invalid date"            | FollowUp record created               |
| **Join Tele-Consultation** | Call connected           | Video call active     | "Call connected"       | "Connection failed"       | TeleConsultation status='in_progress' |

### Reception Module Validations

| Action                 | Expected System Behavior | UI Update           | Success Message       | Error Message     | Database Changes                                 |
| ---------------------- | ------------------------ | ------------------- | --------------------- | ----------------- | ------------------------------------------------ |
| **Register Patient**   | Patient created          | Patient in list     | "Patient registered"  | "Email exists"    | Patient + PortalUser created                     |
| **Create Appointment** | Appointment created      | Appointment in list | "Appointment created" | "Time slot taken" | Appointment created                              |
| **Generate Invoice**   | Invoice created          | Invoice in list     | "Invoice generated"   | "Invalid data"    | Billing record created, invoice number generated |
| **Update Payment**     | Payment recorded         | Bill status updated | "Payment updated"     | "Invalid amount"  | PaymentTransaction created, Billing updated      |

### Nurse Module Validations

| Action                | Expected System Behavior | UI Update              | Success Message      | Error Message       | Database Changes                         |
| --------------------- | ------------------------ | ---------------------- | -------------------- | ------------------- | ---------------------------------------- |
| **Record Vitals**     | Vitals saved             | Vitals in history      | "Vitals recorded"    | "Invalid values"    | PatientVitals record created             |
| **Update Medication** | Schedule updated         | Medication in list     | "Medication updated" | "Invalid schedule"  | MedicationSchedule created/updated       |
| **Allocate Bed**      | Bed allocated            | Bed status='occupied'  | "Bed allocated"      | "Bed unavailable"   | BedAllocation created, status='occupied' |
| **Release Bed**       | Bed released             | Bed status='available' | "Bed released"       | "Bed not allocated" | Status='available', isActive=false       |
| **Trigger Emergency** | Alert created            | Alert visible          | "Alert triggered"    | "Failed"            | EmergencyAlert created                   |

### Lab Module Validations

| Action            | Expected System Behavior | UI Update          | Success Message   | Error Message    | Database Changes                      |
| ----------------- | ------------------------ | ------------------ | ----------------- | ---------------- | ------------------------------------- |
| **Assign Test**   | Test assigned            | Status='assigned'  | "Test assigned"   | "Test not found" | AssignedTo updated, status='assigned' |
| **Upload Report** | Report uploaded          | Status='completed' | "Report uploaded" | "Upload failed"  | ReportUrl saved, status='completed'   |
| **Update Status** | Status updated           | Status changed     | "Status updated"  | "Invalid status" | Status field updated                  |

### Pharmacy Module Validations

| Action             | Expected System Behavior | UI Update           | Success Message   | Error Message        | Database Changes                      |
| ------------------ | ------------------------ | ------------------- | ----------------- | -------------------- | ------------------------------------- |
| **Add Medicine**   | Medicine added           | Medicine in list    | "Medicine added"  | "Duplicate medicine" | Pharmacy record created               |
| **Update Stock**   | Stock updated            | Quantity changed    | "Stock updated"   | "Invalid quantity"   | Quantity updated, status recalculated |
| **Process Order**  | Order processed          | Status='processing' | "Order processed" | "Insufficient stock" | Status updated, stock deducted        |
| **Mark Delivered** | Order delivered          | Status='delivered'  | "Order delivered" | -                    | Status='delivered', deliveredAt set   |

### Admin Module Validations

| Action                 | Expected System Behavior | UI Update         | Success Message       | Error Message         | Database Changes           |
| ---------------------- | ------------------------ | ----------------- | --------------------- | --------------------- | -------------------------- |
| **Add Staff**          | Staff added              | Staff in list     | "Staff added"         | "Email exists"        | Staff + PortalUser created |
| **Update Permissions** | Permissions updated      | Permissions saved | "Permissions updated" | "Invalid permissions" | RolePermission updated     |
| **Add Inventory**      | Item added               | Item in list      | "Item added"          | "Duplicate item"      | Inventory record created   |
| **View Audit Logs**    | Logs displayed           | Logs shown        | -                     | -                     | No changes (read-only)     |

---

## PART D – Test Scenarios

### Positive Test Cases

#### TC-P-001: Patient Books Appointment Successfully

**Preconditions:** Patient logged in, Doctor available
**Steps:**

1. Navigate to Book Appointment
2. Select available doctor
3. Select future date
4. Select available time slot
5. Confirm booking
   **Expected:** Appointment created, confirmation sent

#### TC-P-002: Doctor Writes Prescription

**Preconditions:** Doctor logged in, Appointment in progress
**Steps:**

1. Open appointment
2. Add diagnosis
3. Add medications
4. Save prescription
   **Expected:** Prescription created, patient can view

#### TC-P-003: Reception Generates Invoice

**Preconditions:** Reception logged in, Appointment completed
**Steps:**

1. Select patient
2. Add billing items
3. Calculate total
4. Generate invoice
   **Expected:** Invoice created with unique number

#### TC-P-004: Nurse Records Vitals

**Preconditions:** Nurse logged in, Patient admitted
**Steps:**

1. Select patient
2. Enter vitals (BP, Pulse, Temp, SpO2)
3. Save vitals
   **Expected:** Vitals recorded, BMI calculated

#### TC-P-005: Lab Uploads Report

**Preconditions:** Lab staff logged in, Test assigned
**Steps:**

1. Open test
2. Enter results
3. Upload report file
4. Mark completed
   **Expected:** Report uploaded, doctor notified

#### TC-P-006: Pharmacy Processes Prescription Order

**Preconditions:** Pharmacy logged in, Order pending, Stock available
**Steps:**

1. View pending orders
2. Process order
3. Mark ready
4. Mark delivered
   **Expected:** Order processed, stock deducted

#### TC-P-007: Patient Makes Payment

**Preconditions:** Patient logged in, Unpaid bill exists
**Steps:**

1. View bill
2. Click Pay Now
3. Complete payment gateway
4. Verify payment
   **Expected:** Payment successful, bill status='paid'

#### TC-P-008: Admin Adds Staff Member

**Preconditions:** Admin logged in
**Steps:**

1. Navigate to Staff Management
2. Fill staff form
3. Assign role
4. Save
   **Expected:** Staff added, PortalUser created

---

### Negative Test Cases

#### TC-N-001: Book Appointment When Doctor Unavailable

**Preconditions:** Patient logged in, Doctor not available
**Steps:**

1. Try to book with unavailable doctor
2. Select time slot
3. Attempt to confirm
   **Expected:** Error: "Doctor is not available"

#### TC-N-002: Book Appointment at Taken Time Slot

**Preconditions:** Patient logged in, Time slot already booked
**Steps:**

1. Select doctor
2. Select date
3. Try to book taken time slot
   **Expected:** Error: "Doctor already has appointment at this time"

#### TC-N-003: Cancel Completed Appointment

**Preconditions:** Patient logged in, Appointment status='completed'
**Steps:**

1. View appointments
2. Try to cancel completed appointment
   **Expected:** Error: "Cannot cancel completed appointment"

#### TC-N-004: Payment Fail Scenario

**Preconditions:** Patient logged in, Bill exists
**Steps:**

1. Initiate payment
2. Enter invalid card details
3. Submit payment
   **Expected:** Error: "Payment failed", Transaction status='failed'

#### TC-N-005: Upload Invalid Report Format

**Preconditions:** Lab staff logged in
**Steps:**

1. Try to upload .exe file
2. Submit upload
   **Expected:** Error: "Invalid file type. Only PDF, JPG, PNG allowed"

#### TC-N-006: Upload File Exceeding Size Limit

**Preconditions:** Patient logged in
**Steps:**

1. Try to upload 10MB file (limit 5MB)
2. Submit upload
   **Expected:** Error: "File size exceeds 5MB limit"

#### TC-N-007: Access Unauthorized Resource

**Preconditions:** Reception logged in
**Steps:**

1. Try to access Doctor Dashboard
2. Try to write prescription
   **Expected:** Error: "Access denied. Required role: doctor"

#### TC-N-008: Process Order with Insufficient Stock

**Preconditions:** Pharmacy logged in, Order pending, Stock low
**Steps:**

1. Try to process order
2. Stock insufficient
   **Expected:** Error: "Insufficient stock. Available: X units"

#### TC-N-009: Register Patient with Existing Email

**Preconditions:** Reception logged in
**Steps:**

1. Try to register patient with existing email
2. Submit form
   **Expected:** Error: "Patient with this email already exists"

#### TC-N-010: Delete Staff with Active Assignments

**Preconditions:** Admin logged in, Staff has active appointments
**Steps:**

1. Try to delete staff member
2. Confirm deletion
   **Expected:** Error: "Cannot delete staff with active assignments"

---

### Edge Cases

#### TC-E-001: Book Appointment at Midnight (00:00)

**Preconditions:** Patient logged in
**Steps:**

1. Select date
2. Try to book at 00:00
   **Expected:** Time slot available, booking successful

#### TC-E-002: Multiple Patients Book Same Doctor Simultaneously

**Preconditions:** Two patients logged in, Same time slot available
**Steps:**

1. Both patients select same time
2. Both click confirm simultaneously
   **Expected:** First request succeeds, second fails with conflict error

#### TC-E-003: Expired Medicine Stock Alert

**Preconditions:** Pharmacy logged in, Medicine expired
**Steps:**

1. View stock
2. Check expiry alerts
   **Expected:** Expired medicines highlighted, alert shown

#### TC-E-004: Payment Partial Amount

**Preconditions:** Patient logged in, Bill amount $1000
**Steps:**

1. Pay $500
2. Verify payment
   **Expected:** Bill status='partial', Balance=$500

#### TC-E-005: Reschedule to Past Date

**Preconditions:** Patient logged in, Appointment scheduled
**Steps:**

1. Try to reschedule to past date
   **Expected:** Error: "Cannot reschedule to past date"

#### TC-E-006: Record Vitals with Extreme Values

**Preconditions:** Nurse logged in
**Steps:**

1. Enter BP: 300/200
2. Enter Pulse: 250
3. Save vitals
   **Expected:** Vitals saved, but warning shown for abnormal values

#### TC-E-007: Upload Report Without Results

**Preconditions:** Lab staff logged in
**Steps:**

1. Upload report file
2. Don't enter results
3. Try to mark completed
   **Expected:** Error: "Results required before completion"

#### TC-E-008: Bed Allocation When All Beds Occupied

**Preconditions:** Nurse logged in, All beds occupied
**Steps:**

1. Try to allocate bed
2. No beds available
   **Expected:** Error: "No beds available"

#### TC-E-009: Create Reminder for Past Date

**Preconditions:** Patient logged in
**Steps:**

1. Try to create reminder for yesterday
   **Expected:** Error: "Reminder date must be in future"

#### TC-E-010: Chat Message Empty String

**Preconditions:** Patient logged in
**Steps:**

1. Try to send empty message
2. Submit
   **Expected:** Error: "Message cannot be empty"

---

## PART E – Dummy Test Data / Seeding

### Database Seed Script Structure

```javascript
// backend/prisma/seed.ts (Extended)

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ... existing seed data ...

  // ============================================
  // PATIENT DASHBOARD TEST DATA
  // ============================================

  // Create Test Patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "patient.john@example.com",
        phone: "555-0101",
        dateOfBirth: new Date("1985-05-15"),
        gender: "male",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        emergencyContact: "Jane Doe",
        emergencyPhone: "555-0102",
        insuranceProvider: "BlueCross",
        insuranceNumber: "BC123456789",
        portalUser: {
          create: {
            email: "patient.john@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Sarah",
        lastName: "Smith",
        email: "patient.sarah@example.com",
        phone: "555-0201",
        dateOfBirth: new Date("1990-08-22"),
        gender: "female",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        emergencyContact: "Mike Smith",
        emergencyPhone: "555-0202",
        insuranceProvider: "Aetna",
        insuranceNumber: "AE987654321",
        portalUser: {
          create: {
            email: "patient.sarah@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Mike",
        lastName: "Johnson",
        email: "patient.mike@example.com",
        phone: "555-0301",
        dateOfBirth: new Date("1988-03-10"),
        gender: "male",
        address: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        emergencyContact: "Lisa Johnson",
        emergencyPhone: "555-0302",
        insuranceProvider: "Cigna",
        insuranceNumber: "CI456789123",
        portalUser: {
          create: {
            email: "patient.mike@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Emily",
        lastName: "Davis",
        email: "patient.emily@example.com",
        phone: "555-0401",
        dateOfBirth: new Date("1992-11-05"),
        gender: "female",
        address: "321 Elm St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        emergencyContact: "Tom Davis",
        emergencyPhone: "555-0402",
        insuranceProvider: "UnitedHealth",
        insuranceNumber: "UH789123456",
        portalUser: {
          create: {
            email: "patient.emily@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Robert",
        lastName: "Wilson",
        email: "patient.robert@example.com",
        phone: "555-0501",
        dateOfBirth: new Date("1975-07-20"),
        gender: "male",
        address: "654 Maple Dr",
        city: "Phoenix",
        state: "AZ",
        zipCode: "85001",
        emergencyContact: "Mary Wilson",
        emergencyPhone: "555-0502",
        insuranceProvider: "Humana",
        insuranceNumber: "HU321654987",
        portalUser: {
          create: {
            email: "patient.robert@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Jessica",
        lastName: "Martinez",
        email: "patient.jessica@example.com",
        phone: "555-0601",
        dateOfBirth: new Date("1995-02-14"),
        gender: "female",
        address: "987 Cedar Ln",
        city: "Philadelphia",
        state: "PA",
        zipCode: "19101",
        emergencyContact: "Carlos Martinez",
        emergencyPhone: "555-0602",
        insuranceProvider: "Kaiser",
        insuranceNumber: "KA654321789",
        portalUser: {
          create: {
            email: "patient.jessica@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "David",
        lastName: "Anderson",
        email: "patient.david@example.com",
        phone: "555-0701",
        dateOfBirth: new Date("1980-09-30"),
        gender: "male",
        address: "147 Birch Way",
        city: "San Antonio",
        state: "TX",
        zipCode: "78201",
        emergencyContact: "Susan Anderson",
        emergencyPhone: "555-0702",
        insuranceProvider: "Anthem",
        insuranceNumber: "AN987654321",
        portalUser: {
          create: {
            email: "patient.david@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Amanda",
        lastName: "Taylor",
        email: "patient.amanda@example.com",
        phone: "555-0801",
        dateOfBirth: new Date("1987-12-25"),
        gender: "female",
        address: "258 Spruce Ave",
        city: "San Diego",
        state: "CA",
        zipCode: "92101",
        emergencyContact: "James Taylor",
        emergencyPhone: "555-0802",
        insuranceProvider: "BlueShield",
        insuranceNumber: "BS147258369",
        portalUser: {
          create: {
            email: "patient.amanda@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Christopher",
        lastName: "Thomas",
        email: "patient.christopher@example.com",
        phone: "555-0901",
        dateOfBirth: new Date("1993-04-18"),
        gender: "male",
        address: "369 Willow St",
        city: "Dallas",
        state: "TX",
        zipCode: "75201",
        emergencyContact: "Patricia Thomas",
        emergencyPhone: "555-0902",
        insuranceProvider: "Medicare",
        insuranceNumber: "MC258369147",
        portalUser: {
          create: {
            email: "patient.christopher@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Michelle",
        lastName: "Jackson",
        email: "patient.michelle@example.com",
        phone: "555-1001",
        dateOfBirth: new Date("1991-06-08"),
        gender: "female",
        address: "741 Ash Blvd",
        city: "San Jose",
        state: "CA",
        zipCode: "95101",
        emergencyContact: "Richard Jackson",
        emergencyPhone: "555-1002",
        insuranceProvider: "Tricare",
        insuranceNumber: "TR369147258",
        portalUser: {
          create: {
            email: "patient.michelle@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
    prisma.patient.create({
      data: {
        firstName: "Daniel",
        lastName: "White",
        email: "patient.daniel@example.com",
        phone: "555-1101",
        dateOfBirth: new Date("1984-01-12"),
        gender: "male",
        address: "852 Poplar Ct",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        emergencyContact: "Linda White",
        emergencyPhone: "555-1102",
        insuranceProvider: "Medicaid",
        insuranceNumber: "MD741852963",
        portalUser: {
          create: {
            email: "patient.daniel@example.com",
            passwordHash: await bcrypt.hash("Patient@123", 10),
            role: "patient",
          },
        },
      },
    }),
  ]);

  // Create Test Appointments
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctors[0].id, // Dr. Smith
        date: new Date("2024-12-20"),
        time: "10:00 AM",
        type: "consultation",
        status: "scheduled",
        department: "Cardiology",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctors[1].id, // Dr. Johnson
        date: new Date("2024-12-21"),
        time: "02:00 PM",
        type: "follow-up",
        status: "confirmed",
        department: "General Medicine",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctors[2].id, // Dr. Williams
        date: new Date("2024-12-22"),
        time: "09:00 AM",
        type: "consultation",
        status: "scheduled",
        department: "Pediatrics",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctors[3].id, // Dr. Brown
        date: new Date("2024-12-19"),
        time: "11:00 AM",
        type: "consultation",
        status: "completed",
        department: "Orthopedics",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[4].id,
        doctorId: doctors[4].id, // Dr. Davis
        date: new Date("2024-12-23"),
        time: "03:00 PM",
        type: "follow-up",
        status: "confirmed",
        department: "Neurology",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[5].id,
        doctorId: doctors[0].id, // Dr. Smith
        date: new Date("2024-12-18"),
        time: "02:00 PM",
        type: "consultation",
        status: "completed",
        department: "Cardiology",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[6].id,
        doctorId: doctors[1].id, // Dr. Johnson
        date: new Date("2024-12-24"),
        time: "10:30 AM",
        type: "consultation",
        status: "scheduled",
        department: "General Medicine",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[7].id,
        doctorId: doctors[2].id, // Dr. Williams
        date: new Date("2024-12-17"),
        time: "01:00 PM",
        type: "follow-up",
        status: "cancelled",
        department: "Pediatrics",
        cancellationReason: "Patient rescheduled",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[8].id,
        doctorId: doctors[3].id, // Dr. Brown
        date: new Date("2024-12-25"),
        time: "04:00 PM",
        type: "consultation",
        status: "scheduled",
        department: "Orthopedics",
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[9].id,
        doctorId: doctors[4].id, // Dr. Davis
        date: new Date("2024-12-16"),
        time: "09:30 AM",
        type: "consultation",
        status: "completed",
        department: "Neurology",
      },
    }),
  ]);

  // Create Test Prescriptions
  const prescriptions = await Promise.all([
    prisma.prescription.create({
      data: {
        appointmentId: appointments[0].id,
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        medications: JSON.stringify([
          {
            name: "Aspirin",
            dosage: "100mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take with food",
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "90 days",
            instructions: "Take with meals",
          },
        ]),
        diagnosis: "Hypertension, Type 2 Diabetes",
        instructions: "Monitor blood pressure daily",
        status: "active",
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[1].id,
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        medications: JSON.stringify([
          {
            name: "Ibuprofen",
            dosage: "400mg",
            frequency: "Three times daily",
            duration: "7 days",
            instructions: "Take after meals",
          },
        ]),
        diagnosis: "Common Cold, Fever",
        instructions: "Rest and stay hydrated",
        status: "active",
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[2].id,
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        medications: JSON.stringify([
          {
            name: "Amoxicillin",
            dosage: "250mg",
            frequency: "Twice daily",
            duration: "10 days",
            instructions: "Take with water",
          },
          {
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "As needed",
            duration: "5 days",
            instructions: "For fever above 38°C",
          },
        ]),
        diagnosis: "Bacterial Infection",
        instructions: "Complete full course of antibiotics",
        status: "active",
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[3].id,
        patientId: patients[3].id,
        doctorId: doctors[3].id,
        medications: JSON.stringify([
          {
            name: "Naproxen",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "14 days",
            instructions: "Take with food to avoid stomach upset",
          },
          {
            name: "Calcium",
            dosage: "1000mg",
            frequency: "Once daily",
            duration: "90 days",
            instructions: "Take with vitamin D",
          },
        ]),
        diagnosis: "Joint Pain, Osteoporosis Risk",
        instructions: "Avoid heavy lifting, physical therapy recommended",
        status: "active",
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[4].id,
        patientId: patients[4].id,
        doctorId: doctors[4].id,
        medications: JSON.stringify([
          {
            name: "Gabapentin",
            dosage: "300mg",
            frequency: "Three times daily",
            duration: "30 days",
            instructions: "Take with or without food",
          },
        ]),
        diagnosis: "Neuropathic Pain",
        instructions: "Monitor for dizziness, avoid alcohol",
        status: "active",
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[5].id,
        patientId: patients[5].id,
        doctorId: doctors[0].id,
        medications: JSON.stringify([
          {
            name: "Atorvastatin",
            dosage: "20mg",
            frequency: "Once daily",
            duration: "90 days",
            instructions: "Take at bedtime",
          },
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "90 days",
            instructions: "Take in the morning",
          },
        ]),
        diagnosis: "High Cholesterol, Hypertension",
        instructions:
          "Regular blood pressure monitoring, lipid profile in 3 months",
        status: "active",
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[6].id,
        patientId: patients[6].id,
        doctorId: doctors[1].id,
        medications: JSON.stringify([
          {
            name: "Omeprazole",
            dosage: "20mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take before breakfast",
          },
        ]),
        diagnosis: "GERD (Gastroesophageal Reflux Disease)",
        instructions: "Avoid spicy foods, eat smaller meals",
        status: "active",
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[7].id,
        patientId: patients[7].id,
        doctorId: doctors[2].id,
        medications: JSON.stringify([
          {
            name: "Cetirizine",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "14 days",
            instructions: "Take in the evening",
          },
        ]),
        diagnosis: "Allergic Rhinitis",
        instructions: "Avoid allergens, use nasal spray if needed",
        status: "active",
      },
    }),
  ]);

  // Create Test Bills
  const bills = await Promise.all([
    prisma.billing.create({
      data: {
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        invoiceNumber: "INV-2024-1220-0001",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
          {
            description: "Lab Test - Blood Work",
            quantity: 1,
            unitPrice: 75,
            total: 75,
          },
        ]),
        subtotal: 225,
        tax: 18,
        discount: 0,
        totalAmount: 243,
        paymentStatus: "unpaid",
        paidAmount: 0,
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[1].id,
        appointmentId: appointments[1].id,
        invoiceNumber: "INV-2024-1221-0002",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
        ]),
        subtotal: 150,
        tax: 12,
        discount: 10,
        totalAmount: 152,
        paymentStatus: "paid",
        paidAmount: 152,
        paymentDate: new Date(),
        paymentMethod: "card",
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[2].id,
        appointmentId: appointments[2].id,
        invoiceNumber: "INV-2024-1222-0003",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
          {
            description: "Prescription - Amoxicillin",
            quantity: 1,
            unitPrice: 25,
            total: 25,
          },
        ]),
        subtotal: 175,
        tax: 14,
        discount: 0,
        totalAmount: 189,
        paymentStatus: "unpaid",
        paidAmount: 0,
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[3].id,
        appointmentId: appointments[3].id,
        invoiceNumber: "INV-2024-1219-0004",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 200,
            total: 200,
          },
          {
            description: "X-Ray - Knee",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
        ]),
        subtotal: 350,
        tax: 28,
        discount: 20,
        totalAmount: 358,
        paymentStatus: "partial",
        paidAmount: 200,
        paymentDate: new Date("2024-12-19"),
        paymentMethod: "cash",
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[4].id,
        appointmentId: appointments[4].id,
        invoiceNumber: "INV-2024-1223-0005",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 180,
            total: 180,
          },
          {
            description: "MRI Scan - Brain",
            quantity: 1,
            unitPrice: 500,
            total: 500,
          },
        ]),
        subtotal: 680,
        tax: 54.4,
        discount: 0,
        totalAmount: 734.4,
        paymentStatus: "unpaid",
        paidAmount: 0,
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[5].id,
        appointmentId: appointments[5].id,
        invoiceNumber: "INV-2024-1218-0006",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
          { description: "ECG Test", quantity: 1, unitPrice: 100, total: 100 },
          {
            description: "Blood Test - Lipid Profile",
            quantity: 1,
            unitPrice: 80,
            total: 80,
          },
        ]),
        subtotal: 330,
        tax: 26.4,
        discount: 15,
        totalAmount: 341.4,
        paymentStatus: "paid",
        paidAmount: 341.4,
        paymentDate: new Date("2024-12-18"),
        paymentMethod: "online",
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[6].id,
        appointmentId: appointments[6].id,
        invoiceNumber: "INV-2024-1224-0007",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
        ]),
        subtotal: 150,
        tax: 12,
        discount: 0,
        totalAmount: 162,
        paymentStatus: "unpaid",
        paidAmount: 0,
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[7].id,
        appointmentId: appointments[7].id,
        invoiceNumber: "INV-2024-1217-0008",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 120,
            total: 120,
          },
          {
            description: "Prescription - Cetirizine",
            quantity: 1,
            unitPrice: 15,
            total: 15,
          },
        ]),
        subtotal: 135,
        tax: 10.8,
        discount: 0,
        totalAmount: 145.8,
        paymentStatus: "paid",
        paidAmount: 145.8,
        paymentDate: new Date("2024-12-17"),
        paymentMethod: "card",
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[8].id,
        appointmentId: appointments[8].id,
        invoiceNumber: "INV-2024-1225-0009",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 200,
            total: 200,
          },
          {
            description: "X-Ray - Shoulder",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
        ]),
        subtotal: 350,
        tax: 28,
        discount: 0,
        totalAmount: 378,
        paymentStatus: "unpaid",
        paidAmount: 0,
      },
    }),
    prisma.billing.create({
      data: {
        patientId: patients[9].id,
        appointmentId: appointments[9].id,
        invoiceNumber: "INV-2024-1216-0010",
        items: JSON.stringify([
          {
            description: "Consultation Fee",
            quantity: 1,
            unitPrice: 180,
            total: 180,
          },
          {
            description: "CT Scan - Head",
            quantity: 1,
            unitPrice: 600,
            total: 600,
          },
        ]),
        subtotal: 780,
        tax: 62.4,
        discount: 50,
        totalAmount: 792.4,
        paymentStatus: "partial",
        paidAmount: 400,
        paymentDate: new Date("2024-12-16"),
        paymentMethod: "online",
      },
    }),
  ]);

  // Create Test Lab Reports
  const labTests = await Promise.all([
    prisma.labTest.create({
      data: {
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        doctorId: doctors[0].id,
        requestedBy: staff[0].id, // Reception staff
        testName: "Complete Blood Count",
        testType: "blood",
        testCategory: "pathology",
        status: "completed",
        results: JSON.stringify({
          WBC: {
            value: 7.2,
            unit: "10^3/μL",
            normalRange: "4.0-11.0",
            abnormal: false,
          },
          RBC: {
            value: 4.8,
            unit: "10^6/μL",
            normalRange: "4.5-5.5",
            abnormal: false,
          },
          Hemoglobin: {
            value: 14.5,
            unit: "g/dL",
            normalRange: "12.0-16.0",
            abnormal: false,
          },
        }),
        normalRange: "See individual values",
        abnormalFlag: false,
        reportUrl: "/uploads/reports/lab-report-001.pdf",
        completedDate: new Date(),
      },
    }),
    prisma.labTest.create({
      data: {
        patientId: patients[1].id,
        appointmentId: appointments[1].id,
        doctorId: doctors[1].id,
        requestedBy: staff[0].id,
        testName: "Blood Glucose Test",
        testType: "blood",
        testCategory: "biochemistry",
        status: "completed",
        results: JSON.stringify({
          "Fasting Glucose": {
            value: 95,
            unit: "mg/dL",
            normalRange: "70-100",
            abnormal: false,
          },
          HbA1c: {
            value: 5.8,
            unit: "%",
            normalRange: "4.0-6.0",
            abnormal: false,
          },
        }),
        normalRange: "See individual values",
        abnormalFlag: false,
        reportUrl: "/uploads/reports/lab-report-002.pdf",
        completedDate: new Date(),
      },
    }),
    prisma.labTest.create({
      data: {
        patientId: patients[4].id,
        appointmentId: appointments[4].id,
        doctorId: doctors[4].id,
        requestedBy: staff[0].id,
        testName: "Lipid Profile",
        testType: "blood",
        testCategory: "biochemistry",
        status: "completed",
        results: JSON.stringify({
          "Total Cholesterol": {
            value: 220,
            unit: "mg/dL",
            normalRange: "<200",
            abnormal: true,
          },
          LDL: {
            value: 150,
            unit: "mg/dL",
            normalRange: "<100",
            abnormal: true,
          },
          HDL: {
            value: 45,
            unit: "mg/dL",
            normalRange: ">40",
            abnormal: false,
          },
          Triglycerides: {
            value: 180,
            unit: "mg/dL",
            normalRange: "<150",
            abnormal: true,
          },
        }),
        normalRange: "See individual values",
        abnormalFlag: true,
        reportUrl: "/uploads/reports/lab-report-003.pdf",
        completedDate: new Date(),
      },
    }),
    prisma.labTest.create({
      data: {
        patientId: patients[5].id,
        appointmentId: appointments[5].id,
        doctorId: doctors[0].id,
        requestedBy: staff[0].id,
        testName: "Liver Function Test",
        testType: "blood",
        testCategory: "biochemistry",
        status: "pending",
        results: null,
        normalRange: "Pending",
        abnormalFlag: false,
        reportUrl: null,
        completedDate: null,
      },
    }),
    prisma.labTest.create({
      data: {
        patientId: patients[2].id,
        appointmentId: appointments[2].id,
        doctorId: doctors[2].id,
        requestedBy: staff[0].id,
        testName: "Urine Culture",
        testType: "urine",
        testCategory: "microbiology",
        status: "pending",
        results: null,
        normalRange: "Pending",
        abnormalFlag: false,
        reportUrl: null,
        completedDate: null,
      },
    }),
  ]);

  // Create Test Medicine Stock
  const medicines = await Promise.all([
    prisma.pharmacy.create({
      data: {
        medicineName: "Aspirin",
        genericName: "Acetylsalicylic Acid",
        brandName: "Bayer Aspirin",
        quantity: 500,
        unit: "tablet",
        reorderLevel: 100,
        unitPrice: 0.5,
        sellingPrice: 0.75,
        category: "painkiller",
        manufacturer: "Bayer",
        batchNumber: "BATCH-2024-001",
        expiryDate: new Date("2025-12-31"),
        status: "available",
        shelfLocation: "A-12",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Metformin",
        genericName: "Metformin HCl",
        brandName: "Glucophage",
        quantity: 50,
        unit: "tablet",
        reorderLevel: 100,
        unitPrice: 2.0,
        sellingPrice: 3.0,
        category: "diabetes",
        manufacturer: "Merck",
        batchNumber: "BATCH-2024-002",
        expiryDate: new Date("2025-06-30"),
        status: "low_stock",
        shelfLocation: "B-05",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Amoxicillin",
        genericName: "Amoxicillin",
        brandName: "Amoxil",
        quantity: 0,
        unit: "capsule",
        reorderLevel: 50,
        unitPrice: 1.5,
        sellingPrice: 2.5,
        category: "antibiotic",
        manufacturer: "Pfizer",
        status: "out_of_stock",
        shelfLocation: "C-08",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Ibuprofen",
        genericName: "Ibuprofen",
        brandName: "Advil",
        quantity: 300,
        unit: "tablet",
        reorderLevel: 100,
        unitPrice: 0.75,
        sellingPrice: 1.25,
        category: "painkiller",
        manufacturer: "Pfizer",
        batchNumber: "BATCH-2024-003",
        expiryDate: new Date("2026-03-31"),
        status: "available",
        shelfLocation: "A-15",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Atorvastatin",
        genericName: "Atorvastatin Calcium",
        brandName: "Lipitor",
        quantity: 200,
        unit: "tablet",
        reorderLevel: 50,
        unitPrice: 3.5,
        sellingPrice: 5.0,
        category: "cardiovascular",
        manufacturer: "Pfizer",
        batchNumber: "BATCH-2024-004",
        expiryDate: new Date("2025-09-30"),
        status: "available",
        shelfLocation: "B-10",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Omeprazole",
        genericName: "Omeprazole",
        brandName: "Prilosec",
        quantity: 150,
        unit: "capsule",
        reorderLevel: 50,
        unitPrice: 2.25,
        sellingPrice: 3.5,
        category: "gastrointestinal",
        manufacturer: "AstraZeneca",
        batchNumber: "BATCH-2024-005",
        expiryDate: new Date("2025-11-30"),
        status: "available",
        shelfLocation: "C-03",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Gabapentin",
        genericName: "Gabapentin",
        brandName: "Neurontin",
        quantity: 100,
        unit: "capsule",
        reorderLevel: 30,
        unitPrice: 4.0,
        sellingPrice: 6.0,
        category: "neurological",
        manufacturer: "Pfizer",
        batchNumber: "BATCH-2024-006",
        expiryDate: new Date("2025-08-15"),
        status: "available",
        shelfLocation: "D-07",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Naproxen",
        genericName: "Naproxen Sodium",
        brandName: "Aleve",
        quantity: 80,
        unit: "tablet",
        reorderLevel: 50,
        unitPrice: 1.0,
        sellingPrice: 1.75,
        category: "painkiller",
        manufacturer: "Bayer",
        batchNumber: "BATCH-2024-007",
        expiryDate: new Date("2025-07-20"),
        status: "low_stock",
        shelfLocation: "A-20",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Lisinopril",
        genericName: "Lisinopril",
        brandName: "Zestril",
        quantity: 250,
        unit: "tablet",
        reorderLevel: 75,
        unitPrice: 1.5,
        sellingPrice: 2.5,
        category: "cardiovascular",
        manufacturer: "AstraZeneca",
        batchNumber: "BATCH-2024-008",
        expiryDate: new Date("2026-01-31"),
        status: "available",
        shelfLocation: "B-12",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Cetirizine",
        genericName: "Cetirizine HCl",
        brandName: "Zyrtec",
        quantity: 400,
        unit: "tablet",
        reorderLevel: 100,
        unitPrice: 0.6,
        sellingPrice: 1.0,
        category: "antihistamine",
        manufacturer: "Johnson & Johnson",
        batchNumber: "BATCH-2024-009",
        expiryDate: new Date("2026-05-31"),
        status: "available",
        shelfLocation: "E-05",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Paracetamol",
        genericName: "Acetaminophen",
        brandName: "Tylenol",
        quantity: 600,
        unit: "tablet",
        reorderLevel: 150,
        unitPrice: 0.4,
        sellingPrice: 0.75,
        category: "painkiller",
        manufacturer: "Johnson & Johnson",
        batchNumber: "BATCH-2024-010",
        expiryDate: new Date("2026-02-28"),
        status: "available",
        shelfLocation: "A-08",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Calcium Carbonate",
        genericName: "Calcium Carbonate",
        brandName: "Tums",
        quantity: 350,
        unit: "tablet",
        reorderLevel: 100,
        unitPrice: 0.3,
        sellingPrice: 0.6,
        category: "supplement",
        manufacturer: "GlaxoSmithKline",
        batchNumber: "BATCH-2024-011",
        expiryDate: new Date("2026-08-31"),
        status: "available",
        shelfLocation: "F-12",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Vitamin D3",
        genericName: "Cholecalciferol",
        brandName: "D3-5000",
        quantity: 180,
        unit: "capsule",
        reorderLevel: 50,
        unitPrice: 1.25,
        sellingPrice: 2.0,
        category: "supplement",
        manufacturer: "Nature Made",
        batchNumber: "BATCH-2024-012",
        expiryDate: new Date("2025-12-31"),
        status: "available",
        shelfLocation: "F-15",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Azithromycin",
        genericName: "Azithromycin",
        brandName: "Zithromax",
        quantity: 25,
        unit: "tablet",
        reorderLevel: 50,
        unitPrice: 3.0,
        sellingPrice: 5.0,
        category: "antibiotic",
        manufacturer: "Pfizer",
        batchNumber: "BATCH-2024-013",
        expiryDate: new Date("2025-04-30"),
        status: "low_stock",
        shelfLocation: "C-12",
      },
    }),
    prisma.pharmacy.create({
      data: {
        medicineName: "Levothyroxine",
        genericName: "Levothyroxine Sodium",
        brandName: "Synthroid",
        quantity: 120,
        unit: "tablet",
        reorderLevel: 40,
        unitPrice: 2.75,
        sellingPrice: 4.5,
        category: "hormone",
        manufacturer: "AbbVie",
        batchNumber: "BATCH-2024-014",
        expiryDate: new Date("2025-10-31"),
        status: "available",
        shelfLocation: "D-20",
      },
    }),
  ]);

  // Create Test Reminders
  const reminders = await Promise.all([
    prisma.reminder.create({
      data: {
        patientId: patients[0].id,
        reminderType: "medication",
        title: "Take Aspirin",
        description: "Take 100mg Aspirin with food",
        scheduledDate: new Date("2024-12-20"),
        scheduledTime: "08:00",
        isRecurring: true,
        recurrenceRule: "daily",
        notificationMethod: "app",
        status: "pending",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[1].id,
        reminderType: "appointment",
        title: "Follow-up Appointment",
        description: "Follow-up appointment with Dr. Johnson on Dec 21",
        scheduledDate: new Date("2024-12-21"),
        scheduledTime: "13:00",
        isRecurring: false,
        recurrenceRule: null,
        notificationMethod: "email",
        status: "pending",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[2].id,
        reminderType: "medication",
        title: "Take Amoxicillin",
        description: "Take 250mg Amoxicillin twice daily",
        scheduledDate: new Date("2024-12-22"),
        scheduledTime: "08:00",
        isRecurring: true,
        recurrenceRule: "twice_daily",
        notificationMethod: "app",
        status: "pending",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[3].id,
        reminderType: "medication",
        title: "Take Naproxen",
        description: "Take 500mg Naproxen with food",
        scheduledDate: new Date("2024-12-19"),
        scheduledTime: "09:00",
        isRecurring: true,
        recurrenceRule: "twice_daily",
        notificationMethod: "sms",
        status: "completed",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[4].id,
        reminderType: "medication",
        title: "Take Gabapentin",
        description: "Take 300mg Gabapentin three times daily",
        scheduledDate: new Date("2024-12-23"),
        scheduledTime: "08:00",
        isRecurring: true,
        recurrenceRule: "thrice_daily",
        notificationMethod: "app",
        status: "pending",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[5].id,
        reminderType: "medication",
        title: "Take Atorvastatin",
        description: "Take 20mg Atorvastatin at bedtime",
        scheduledDate: new Date("2024-12-18"),
        scheduledTime: "22:00",
        isRecurring: true,
        recurrenceRule: "daily",
        notificationMethod: "app",
        status: "pending",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[6].id,
        reminderType: "appointment",
        title: "Upcoming Consultation",
        description: "Consultation with Dr. Johnson on Dec 24",
        scheduledDate: new Date("2024-12-24"),
        scheduledTime: "09:00",
        isRecurring: false,
        recurrenceRule: null,
        notificationMethod: "email",
        status: "pending",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[7].id,
        reminderType: "medication",
        title: "Take Cetirizine",
        description: "Take 10mg Cetirizine in the evening",
        scheduledDate: new Date("2024-12-17"),
        scheduledTime: "20:00",
        isRecurring: true,
        recurrenceRule: "daily",
        notificationMethod: "app",
        status: "completed",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[8].id,
        reminderType: "appointment",
        title: "Orthopedic Consultation",
        description: "Consultation with Dr. Brown on Dec 25",
        scheduledDate: new Date("2024-12-25"),
        scheduledTime: "15:00",
        isRecurring: false,
        recurrenceRule: null,
        notificationMethod: "sms",
        status: "pending",
      },
    }),
    prisma.reminder.create({
      data: {
        patientId: patients[9].id,
        reminderType: "medication",
        title: "Take Prescribed Medication",
        description: "Follow prescription instructions",
        scheduledDate: new Date("2024-12-16"),
        scheduledTime: "08:00",
        isRecurring: true,
        recurrenceRule: "daily",
        notificationMethod: "app",
        status: "pending",
      },
    }),
  ]);

  // Create Test Chat Messages
  const chatMessages = await Promise.all([
    prisma.chatMessage.create({
      data: {
        patientId: patients[0].id,
        senderId: patients[0].id,
        senderType: "patient",
        message: "Hello, I need help with my prescription",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[0].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message: "Hello! How can I assist you with your prescription?",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[1].id,
        senderId: patients[1].id,
        senderType: "patient",
        message: "I have a question about my upcoming appointment",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[1].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message: "Sure, what would you like to know?",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[2].id,
        senderId: patients[2].id,
        senderType: "patient",
        message: "Can I reschedule my appointment?",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[2].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message:
          "Yes, you can reschedule through the appointments section or I can help you with that.",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[3].id,
        senderId: patients[3].id,
        senderType: "patient",
        message: "I need a copy of my lab report",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[3].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message:
          "You can download it from the Reports section. If you need assistance, let me know.",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[4].id,
        senderId: patients[4].id,
        senderType: "patient",
        message: "What are the payment options available?",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[4].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message: "We accept cash, card, and online payments through Razorpay.",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[5].id,
        senderId: patients[5].id,
        senderType: "patient",
        message:
          "I forgot to take my medication this morning. What should I do?",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[5].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message:
          "Take it as soon as you remember, but do not double the dose. Continue with your regular schedule.",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[6].id,
        senderId: patients[6].id,
        senderType: "patient",
        message: "How do I upload my insurance documents?",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[6].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message:
          "Go to the Insurance section and click Upload Document. Supported formats are PDF, JPG, and PNG.",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[7].id,
        senderId: patients[7].id,
        senderType: "patient",
        message: "I have a billing question",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[7].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message:
          "Please share your invoice number and I will help you with your billing query.",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[8].id,
        senderId: patients[8].id,
        senderType: "patient",
        message: "Can I get a prescription refill?",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[8].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message:
          "You will need to schedule an appointment with your doctor for a prescription refill.",
        messageType: "text",
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[9].id,
        senderId: patients[9].id,
        senderType: "patient",
        message: "I need to cancel my appointment",
        messageType: "text",
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        patientId: patients[9].id,
        senderId: "support-staff-id",
        senderType: "staff",
        message:
          "You can cancel it from the My Appointments section. Cancellations must be made at least 2 hours before the appointment.",
        messageType: "text",
        isRead: true,
      },
    }),
  ]);

  // Create Test Feedback
  const feedbacks = await Promise.all([
    prisma.feedback.create({
      data: {
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        doctorId: doctors[0].id,
        feedbackType: "doctor",
        rating: 5,
        comment: "Excellent doctor, very helpful and professional",
        cleanliness: 5,
        staffBehavior: 5,
        waitTime: 4,
        overallExperience: 5,
        status: "submitted",
      },
    }),
    prisma.feedback.create({
      data: {
        patientId: patients[1].id,
        appointmentId: appointments[1].id,
        doctorId: doctors[1].id,
        feedbackType: "doctor",
        rating: 4,
        comment:
          "Good consultation, doctor was attentive and explained everything clearly",
        cleanliness: 5,
        staffBehavior: 4,
        waitTime: 3,
        overallExperience: 4,
        status: "submitted",
      },
    }),
    prisma.feedback.create({
      data: {
        patientId: patients[3].id,
        appointmentId: appointments[3].id,
        doctorId: doctors[3].id,
        feedbackType: "doctor",
        rating: 5,
        comment:
          "Excellent service! Dr. Brown was very professional and helpful with my orthopedic issue.",
        cleanliness: 5,
        staffBehavior: 5,
        waitTime: 4,
        overallExperience: 5,
        status: "submitted",
      },
    }),
    prisma.feedback.create({
      data: {
        patientId: patients[5].id,
        appointmentId: appointments[5].id,
        doctorId: doctors[0].id,
        feedbackType: "hospital",
        rating: 4,
        comment:
          "Overall good experience. The facility is clean and well-maintained.",
        cleanliness: 5,
        staffBehavior: 4,
        waitTime: 3,
        overallExperience: 4,
        status: "submitted",
      },
    }),
    prisma.feedback.create({
      data: {
        patientId: patients[7].id,
        appointmentId: appointments[7].id,
        doctorId: doctors[2].id,
        feedbackType: "service",
        rating: 3,
        comment: "Service was okay, but wait time was longer than expected",
        cleanliness: 4,
        staffBehavior: 3,
        waitTime: 2,
        overallExperience: 3,
        status: "submitted",
      },
    }),
  ]);

  console.log("✅ Patient Dashboard test data seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### JSON Test Data Format

```json
{
  "doctors": [
    {
      "empId": "DOC001",
      "firstName": "Robert",
      "lastName": "Smith",
      "email": "dr.smith@hopephysicians.com",
      "phone": "555-1001",
      "specialization": "Cardiology",
      "licenseNumber": "MD-12345",
      "yearsOfExperience": 15,
      "isAvailable": true
    },
    {
      "empId": "DOC002",
      "firstName": "Emily",
      "lastName": "Johnson",
      "email": "dr.johnson@hopephysicians.com",
      "phone": "555-1002",
      "specialization": "General Medicine",
      "licenseNumber": "MD-12346",
      "yearsOfExperience": 10,
      "isAvailable": true
    },
    {
      "empId": "DOC003",
      "firstName": "Michael",
      "lastName": "Williams",
      "email": "dr.williams@hopephysicians.com",
      "phone": "555-1003",
      "specialization": "Pediatrics",
      "licenseNumber": "MD-12347",
      "yearsOfExperience": 8,
      "isAvailable": true
    },
    {
      "empId": "DOC004",
      "firstName": "Jennifer",
      "lastName": "Brown",
      "email": "dr.brown@hopephysicians.com",
      "phone": "555-1004",
      "specialization": "Orthopedics",
      "licenseNumber": "MD-12348",
      "yearsOfExperience": 12,
      "isAvailable": true
    },
    {
      "empId": "DOC005",
      "firstName": "David",
      "lastName": "Davis",
      "email": "dr.davis@hopephysicians.com",
      "phone": "555-1005",
      "specialization": "Neurology",
      "licenseNumber": "MD-12349",
      "yearsOfExperience": 20,
      "isAvailable": true
    }
  ],
  "patients": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "patient.john@example.com",
      "phone": "555-0101",
      "dateOfBirth": "1985-05-15",
      "gender": "male",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "emergencyContact": "Jane Doe",
      "emergencyPhone": "555-0102",
      "insuranceProvider": "BlueCross",
      "insuranceNumber": "BC123456789"
    },
    {
      "firstName": "Sarah",
      "lastName": "Smith",
      "email": "patient.sarah@example.com",
      "phone": "555-0201",
      "dateOfBirth": "1990-08-22",
      "gender": "female",
      "address": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90001",
      "emergencyContact": "Mike Smith",
      "emergencyPhone": "555-0202",
      "insuranceProvider": "Aetna",
      "insuranceNumber": "AE987654321"
    },
    {
      "firstName": "Mike",
      "lastName": "Johnson",
      "email": "patient.mike@example.com",
      "phone": "555-0301",
      "dateOfBirth": "1988-03-10",
      "gender": "male",
      "address": "789 Pine Rd",
      "city": "Chicago",
      "state": "IL",
      "zipCode": "60601",
      "emergencyContact": "Lisa Johnson",
      "emergencyPhone": "555-0302",
      "insuranceProvider": "Cigna",
      "insuranceNumber": "CI456789123"
    },
    {
      "firstName": "Emily",
      "lastName": "Davis",
      "email": "patient.emily@example.com",
      "phone": "555-0401",
      "dateOfBirth": "1992-11-05",
      "gender": "female",
      "address": "321 Elm St",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77001",
      "emergencyContact": "Tom Davis",
      "emergencyPhone": "555-0402",
      "insuranceProvider": "UnitedHealth",
      "insuranceNumber": "UH789123456"
    },
    {
      "firstName": "Robert",
      "lastName": "Wilson",
      "email": "patient.robert@example.com",
      "phone": "555-0501",
      "dateOfBirth": "1975-07-20",
      "gender": "male",
      "address": "654 Maple Dr",
      "city": "Phoenix",
      "state": "AZ",
      "zipCode": "85001",
      "emergencyContact": "Mary Wilson",
      "emergencyPhone": "555-0502",
      "insuranceProvider": "Humana",
      "insuranceNumber": "HU321654987"
    },
    {
      "firstName": "Jessica",
      "lastName": "Martinez",
      "email": "patient.jessica@example.com",
      "phone": "555-0601",
      "dateOfBirth": "1995-02-14",
      "gender": "female",
      "address": "987 Cedar Ln",
      "city": "Philadelphia",
      "state": "PA",
      "zipCode": "19101",
      "emergencyContact": "Carlos Martinez",
      "emergencyPhone": "555-0602",
      "insuranceProvider": "Kaiser",
      "insuranceNumber": "KA654321789"
    },
    {
      "firstName": "David",
      "lastName": "Anderson",
      "email": "patient.david@example.com",
      "phone": "555-0701",
      "dateOfBirth": "1980-09-30",
      "gender": "male",
      "address": "147 Birch Way",
      "city": "San Antonio",
      "state": "TX",
      "zipCode": "78201",
      "emergencyContact": "Susan Anderson",
      "emergencyPhone": "555-0702",
      "insuranceProvider": "Anthem",
      "insuranceNumber": "AN987654321"
    },
    {
      "firstName": "Amanda",
      "lastName": "Taylor",
      "email": "patient.amanda@example.com",
      "phone": "555-0801",
      "dateOfBirth": "1987-12-25",
      "gender": "female",
      "address": "258 Spruce Ave",
      "city": "San Diego",
      "state": "CA",
      "zipCode": "92101",
      "emergencyContact": "James Taylor",
      "emergencyPhone": "555-0802",
      "insuranceProvider": "BlueShield",
      "insuranceNumber": "BS147258369"
    },
    {
      "firstName": "Christopher",
      "lastName": "Thomas",
      "email": "patient.christopher@example.com",
      "phone": "555-0901",
      "dateOfBirth": "1993-04-18",
      "gender": "male",
      "address": "369 Willow St",
      "city": "Dallas",
      "state": "TX",
      "zipCode": "75201",
      "emergencyContact": "Patricia Thomas",
      "emergencyPhone": "555-0902",
      "insuranceProvider": "Medicare",
      "insuranceNumber": "MC258369147"
    },
    {
      "firstName": "Michelle",
      "lastName": "Jackson",
      "email": "patient.michelle@example.com",
      "phone": "555-1001",
      "dateOfBirth": "1991-06-08",
      "gender": "female",
      "address": "741 Ash Blvd",
      "city": "San Jose",
      "state": "CA",
      "zipCode": "95101",
      "emergencyContact": "Richard Jackson",
      "emergencyPhone": "555-1002",
      "insuranceProvider": "Tricare",
      "insuranceNumber": "TR369147258"
    },
    {
      "firstName": "Daniel",
      "lastName": "White",
      "email": "patient.daniel@example.com",
      "phone": "555-1101",
      "dateOfBirth": "1984-01-12",
      "gender": "male",
      "address": "852 Poplar Ct",
      "city": "Austin",
      "state": "TX",
      "zipCode": "78701",
      "emergencyContact": "Linda White",
      "emergencyPhone": "555-1102",
      "insuranceProvider": "Medicaid",
      "insuranceNumber": "MD741852963"
    }
  ],
  "appointments": [
    {
      "patientEmail": "patient.john@example.com",
      "doctorEmail": "dr.smith@hopephysicians.com",
      "date": "2024-12-20",
      "time": "10:00 AM",
      "type": "consultation",
      "status": "scheduled",
      "department": "Cardiology"
    },
    {
      "patientEmail": "patient.sarah@example.com",
      "doctorEmail": "dr.johnson@hopephysicians.com",
      "date": "2024-12-21",
      "time": "02:00 PM",
      "type": "follow-up",
      "status": "confirmed",
      "department": "General Medicine"
    },
    {
      "patientEmail": "patient.mike@example.com",
      "doctorEmail": "dr.williams@hopephysicians.com",
      "date": "2024-12-22",
      "time": "09:00 AM",
      "type": "consultation",
      "status": "scheduled",
      "department": "Pediatrics"
    },
    {
      "patientEmail": "patient.emily@example.com",
      "doctorEmail": "dr.brown@hopephysicians.com",
      "date": "2024-12-19",
      "time": "11:00 AM",
      "type": "consultation",
      "status": "completed",
      "department": "Orthopedics"
    },
    {
      "patientEmail": "patient.robert@example.com",
      "doctorEmail": "dr.davis@hopephysicians.com",
      "date": "2024-12-23",
      "time": "03:00 PM",
      "type": "follow-up",
      "status": "confirmed",
      "department": "Neurology"
    },
    {
      "patientEmail": "patient.jessica@example.com",
      "doctorEmail": "dr.smith@hopephysicians.com",
      "date": "2024-12-18",
      "time": "02:00 PM",
      "type": "consultation",
      "status": "completed",
      "department": "Cardiology"
    },
    {
      "patientEmail": "patient.david@example.com",
      "doctorEmail": "dr.johnson@hopephysicians.com",
      "date": "2024-12-24",
      "time": "10:30 AM",
      "type": "consultation",
      "status": "scheduled",
      "department": "General Medicine"
    },
    {
      "patientEmail": "patient.amanda@example.com",
      "doctorEmail": "dr.williams@hopephysicians.com",
      "date": "2024-12-17",
      "time": "01:00 PM",
      "type": "follow-up",
      "status": "cancelled",
      "department": "Pediatrics"
    },
    {
      "patientEmail": "patient.christopher@example.com",
      "doctorEmail": "dr.brown@hopephysicians.com",
      "date": "2024-12-25",
      "time": "04:00 PM",
      "type": "consultation",
      "status": "scheduled",
      "department": "Orthopedics"
    },
    {
      "patientEmail": "patient.michelle@example.com",
      "doctorEmail": "dr.davis@hopephysicians.com",
      "date": "2024-12-16",
      "time": "09:30 AM",
      "type": "consultation",
      "status": "completed",
      "department": "Neurology"
    }
  ],
  "prescriptions": [
    {
      "appointmentId": 1,
      "medications": [
        {
          "name": "Aspirin",
          "dosage": "100mg",
          "frequency": "Once daily",
          "duration": "30 days",
          "instructions": "Take with food"
        },
        {
          "name": "Metformin",
          "dosage": "500mg",
          "frequency": "Twice daily",
          "duration": "90 days",
          "instructions": "Take with meals"
        }
      ],
      "diagnosis": "Hypertension, Type 2 Diabetes",
      "instructions": "Monitor blood pressure daily"
    },
    {
      "appointmentId": 2,
      "medications": [
        {
          "name": "Ibuprofen",
          "dosage": "400mg",
          "frequency": "Three times daily",
          "duration": "7 days",
          "instructions": "Take after meals"
        }
      ],
      "diagnosis": "Common Cold, Fever",
      "instructions": "Rest and stay hydrated"
    },
    {
      "appointmentId": 3,
      "medications": [
        {
          "name": "Amoxicillin",
          "dosage": "250mg",
          "frequency": "Twice daily",
          "duration": "10 days",
          "instructions": "Take with water"
        },
        {
          "name": "Paracetamol",
          "dosage": "500mg",
          "frequency": "As needed",
          "duration": "5 days",
          "instructions": "For fever above 38°C"
        }
      ],
      "diagnosis": "Bacterial Infection",
      "instructions": "Complete full course of antibiotics"
    },
    {
      "appointmentId": 4,
      "medications": [
        {
          "name": "Naproxen",
          "dosage": "500mg",
          "frequency": "Twice daily",
          "duration": "14 days",
          "instructions": "Take with food to avoid stomach upset"
        },
        {
          "name": "Calcium",
          "dosage": "1000mg",
          "frequency": "Once daily",
          "duration": "90 days",
          "instructions": "Take with vitamin D"
        }
      ],
      "diagnosis": "Joint Pain, Osteoporosis Risk",
      "instructions": "Avoid heavy lifting, physical therapy recommended"
    },
    {
      "appointmentId": 5,
      "medications": [
        {
          "name": "Gabapentin",
          "dosage": "300mg",
          "frequency": "Three times daily",
          "duration": "30 days",
          "instructions": "Take with or without food"
        }
      ],
      "diagnosis": "Neuropathic Pain",
      "instructions": "Monitor for dizziness, avoid alcohol"
    },
    {
      "appointmentId": 6,
      "medications": [
        {
          "name": "Atorvastatin",
          "dosage": "20mg",
          "frequency": "Once daily",
          "duration": "90 days",
          "instructions": "Take at bedtime"
        },
        {
          "name": "Lisinopril",
          "dosage": "10mg",
          "frequency": "Once daily",
          "duration": "90 days",
          "instructions": "Take in the morning"
        }
      ],
      "diagnosis": "High Cholesterol, Hypertension",
      "instructions": "Regular blood pressure monitoring, lipid profile in 3 months"
    },
    {
      "appointmentId": 7,
      "medications": [
        {
          "name": "Omeprazole",
          "dosage": "20mg",
          "frequency": "Once daily",
          "duration": "30 days",
          "instructions": "Take before breakfast"
        }
      ],
      "diagnosis": "GERD (Gastroesophageal Reflux Disease)",
      "instructions": "Avoid spicy foods, eat smaller meals"
    },
    {
      "appointmentId": 8,
      "medications": [
        {
          "name": "Cetirizine",
          "dosage": "10mg",
          "frequency": "Once daily",
          "duration": "14 days",
          "instructions": "Take in the evening"
        }
      ],
      "diagnosis": "Allergic Rhinitis",
      "instructions": "Avoid allergens, use nasal spray if needed"
    }
  ],
  "bills": [
    {
      "patientEmail": "patient.john@example.com",
      "appointmentId": 1,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        },
        {
          "description": "Lab Test - Blood Work",
          "quantity": 1,
          "unitPrice": 75,
          "total": 75
        }
      ],
      "subtotal": 225,
      "tax": 18,
      "discount": 0,
      "totalAmount": 243,
      "paymentStatus": "unpaid"
    },
    {
      "patientEmail": "patient.sarah@example.com",
      "appointmentId": 2,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        }
      ],
      "subtotal": 150,
      "tax": 12,
      "discount": 10,
      "totalAmount": 152,
      "paymentStatus": "paid",
      "paidAmount": 152,
      "paymentMethod": "card"
    },
    {
      "patientEmail": "patient.mike@example.com",
      "appointmentId": 3,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        },
        {
          "description": "Prescription - Amoxicillin",
          "quantity": 1,
          "unitPrice": 25,
          "total": 25
        }
      ],
      "subtotal": 175,
      "tax": 14,
      "discount": 0,
      "totalAmount": 189,
      "paymentStatus": "unpaid"
    },
    {
      "patientEmail": "patient.emily@example.com",
      "appointmentId": 4,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 200,
          "total": 200
        },
        {
          "description": "X-Ray - Knee",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        }
      ],
      "subtotal": 350,
      "tax": 28,
      "discount": 20,
      "totalAmount": 358,
      "paymentStatus": "partial",
      "paidAmount": 200,
      "paymentMethod": "cash"
    },
    {
      "patientEmail": "patient.robert@example.com",
      "appointmentId": 5,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 180,
          "total": 180
        },
        {
          "description": "MRI Scan - Brain",
          "quantity": 1,
          "unitPrice": 500,
          "total": 500
        }
      ],
      "subtotal": 680,
      "tax": 54.4,
      "discount": 0,
      "totalAmount": 734.4,
      "paymentStatus": "unpaid"
    },
    {
      "patientEmail": "patient.jessica@example.com",
      "appointmentId": 6,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        },
        {
          "description": "ECG Test",
          "quantity": 1,
          "unitPrice": 100,
          "total": 100
        },
        {
          "description": "Blood Test - Lipid Profile",
          "quantity": 1,
          "unitPrice": 80,
          "total": 80
        }
      ],
      "subtotal": 330,
      "tax": 26.4,
      "discount": 15,
      "totalAmount": 341.4,
      "paymentStatus": "paid",
      "paidAmount": 341.4,
      "paymentMethod": "online"
    },
    {
      "patientEmail": "patient.david@example.com",
      "appointmentId": 7,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        }
      ],
      "subtotal": 150,
      "tax": 12,
      "discount": 0,
      "totalAmount": 162,
      "paymentStatus": "unpaid"
    },
    {
      "patientEmail": "patient.amanda@example.com",
      "appointmentId": 8,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 120,
          "total": 120
        },
        {
          "description": "Prescription - Cetirizine",
          "quantity": 1,
          "unitPrice": 15,
          "total": 15
        }
      ],
      "subtotal": 135,
      "tax": 10.8,
      "discount": 0,
      "totalAmount": 145.8,
      "paymentStatus": "paid",
      "paidAmount": 145.8,
      "paymentMethod": "card"
    },
    {
      "patientEmail": "patient.christopher@example.com",
      "appointmentId": 9,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 200,
          "total": 200
        },
        {
          "description": "X-Ray - Shoulder",
          "quantity": 1,
          "unitPrice": 150,
          "total": 150
        }
      ],
      "subtotal": 350,
      "tax": 28,
      "discount": 0,
      "totalAmount": 378,
      "paymentStatus": "unpaid"
    },
    {
      "patientEmail": "patient.michelle@example.com",
      "appointmentId": 10,
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 180,
          "total": 180
        },
        {
          "description": "CT Scan - Head",
          "quantity": 1,
          "unitPrice": 600,
          "total": 600
        }
      ],
      "subtotal": 780,
      "tax": 62.4,
      "discount": 50,
      "totalAmount": 792.4,
      "paymentStatus": "partial",
      "paidAmount": 400,
      "paymentMethod": "online"
    }
  ],
  "medicines": [
    {
      "medicineName": "Aspirin",
      "genericName": "Acetylsalicylic Acid",
      "brandName": "Bayer Aspirin",
      "quantity": 500,
      "unit": "tablet",
      "reorderLevel": 100,
      "unitPrice": 0.5,
      "sellingPrice": 0.75,
      "category": "painkiller",
      "manufacturer": "Bayer",
      "batchNumber": "BATCH-2024-001",
      "expiryDate": "2025-12-31",
      "status": "available",
      "shelfLocation": "A-12"
    },
    {
      "medicineName": "Metformin",
      "genericName": "Metformin HCl",
      "brandName": "Glucophage",
      "quantity": 50,
      "unit": "tablet",
      "reorderLevel": 100,
      "unitPrice": 2.0,
      "sellingPrice": 3.0,
      "category": "diabetes",
      "manufacturer": "Merck",
      "batchNumber": "BATCH-2024-002",
      "expiryDate": "2025-06-30",
      "status": "low_stock",
      "shelfLocation": "B-05"
    },
    {
      "medicineName": "Amoxicillin",
      "genericName": "Amoxicillin",
      "brandName": "Amoxil",
      "quantity": 0,
      "unit": "capsule",
      "reorderLevel": 50,
      "unitPrice": 1.5,
      "sellingPrice": 2.5,
      "category": "antibiotic",
      "manufacturer": "Pfizer",
      "status": "out_of_stock",
      "shelfLocation": "C-08"
    },
    {
      "medicineName": "Ibuprofen",
      "genericName": "Ibuprofen",
      "brandName": "Advil",
      "quantity": 300,
      "unit": "tablet",
      "reorderLevel": 100,
      "unitPrice": 0.75,
      "sellingPrice": 1.25,
      "category": "painkiller",
      "manufacturer": "Pfizer",
      "batchNumber": "BATCH-2024-003",
      "expiryDate": "2026-03-31",
      "status": "available",
      "shelfLocation": "A-15"
    },
    {
      "medicineName": "Atorvastatin",
      "genericName": "Atorvastatin Calcium",
      "brandName": "Lipitor",
      "quantity": 200,
      "unit": "tablet",
      "reorderLevel": 50,
      "unitPrice": 3.5,
      "sellingPrice": 5.0,
      "category": "cardiovascular",
      "manufacturer": "Pfizer",
      "batchNumber": "BATCH-2024-004",
      "expiryDate": "2025-09-30",
      "status": "available",
      "shelfLocation": "B-10"
    },
    {
      "medicineName": "Omeprazole",
      "genericName": "Omeprazole",
      "brandName": "Prilosec",
      "quantity": 150,
      "unit": "capsule",
      "reorderLevel": 50,
      "unitPrice": 2.25,
      "sellingPrice": 3.5,
      "category": "gastrointestinal",
      "manufacturer": "AstraZeneca",
      "batchNumber": "BATCH-2024-005",
      "expiryDate": "2025-11-30",
      "status": "available",
      "shelfLocation": "C-03"
    },
    {
      "medicineName": "Gabapentin",
      "genericName": "Gabapentin",
      "brandName": "Neurontin",
      "quantity": 100,
      "unit": "capsule",
      "reorderLevel": 30,
      "unitPrice": 4.0,
      "sellingPrice": 6.0,
      "category": "neurological",
      "manufacturer": "Pfizer",
      "batchNumber": "BATCH-2024-006",
      "expiryDate": "2025-08-15",
      "status": "available",
      "shelfLocation": "D-07"
    },
    {
      "medicineName": "Naproxen",
      "genericName": "Naproxen Sodium",
      "brandName": "Aleve",
      "quantity": 80,
      "unit": "tablet",
      "reorderLevel": 50,
      "unitPrice": 1.0,
      "sellingPrice": 1.75,
      "category": "painkiller",
      "manufacturer": "Bayer",
      "batchNumber": "BATCH-2024-007",
      "expiryDate": "2025-07-20",
      "status": "low_stock",
      "shelfLocation": "A-20"
    },
    {
      "medicineName": "Lisinopril",
      "genericName": "Lisinopril",
      "brandName": "Zestril",
      "quantity": 250,
      "unit": "tablet",
      "reorderLevel": 75,
      "unitPrice": 1.5,
      "sellingPrice": 2.5,
      "category": "cardiovascular",
      "manufacturer": "AstraZeneca",
      "batchNumber": "BATCH-2024-008",
      "expiryDate": "2026-01-31",
      "status": "available",
      "shelfLocation": "B-12"
    },
    {
      "medicineName": "Cetirizine",
      "genericName": "Cetirizine HCl",
      "brandName": "Zyrtec",
      "quantity": 400,
      "unit": "tablet",
      "reorderLevel": 100,
      "unitPrice": 0.6,
      "sellingPrice": 1.0,
      "category": "antihistamine",
      "manufacturer": "Johnson & Johnson",
      "batchNumber": "BATCH-2024-009",
      "expiryDate": "2026-05-31",
      "status": "available",
      "shelfLocation": "E-05"
    },
    {
      "medicineName": "Paracetamol",
      "genericName": "Acetaminophen",
      "brandName": "Tylenol",
      "quantity": 600,
      "unit": "tablet",
      "reorderLevel": 150,
      "unitPrice": 0.4,
      "sellingPrice": 0.75,
      "category": "painkiller",
      "manufacturer": "Johnson & Johnson",
      "batchNumber": "BATCH-2024-010",
      "expiryDate": "2026-02-28",
      "status": "available",
      "shelfLocation": "A-08"
    },
    {
      "medicineName": "Calcium Carbonate",
      "genericName": "Calcium Carbonate",
      "brandName": "Tums",
      "quantity": 350,
      "unit": "tablet",
      "reorderLevel": 100,
      "unitPrice": 0.3,
      "sellingPrice": 0.6,
      "category": "supplement",
      "manufacturer": "GlaxoSmithKline",
      "batchNumber": "BATCH-2024-011",
      "expiryDate": "2026-08-31",
      "status": "available",
      "shelfLocation": "F-12"
    },
    {
      "medicineName": "Vitamin D3",
      "genericName": "Cholecalciferol",
      "brandName": "D3-5000",
      "quantity": 180,
      "unit": "capsule",
      "reorderLevel": 50,
      "unitPrice": 1.25,
      "sellingPrice": 2.0,
      "category": "supplement",
      "manufacturer": "Nature Made",
      "batchNumber": "BATCH-2024-012",
      "expiryDate": "2025-12-31",
      "status": "available",
      "shelfLocation": "F-15"
    },
    {
      "medicineName": "Azithromycin",
      "genericName": "Azithromycin",
      "brandName": "Zithromax",
      "quantity": 25,
      "unit": "tablet",
      "reorderLevel": 50,
      "unitPrice": 3.0,
      "sellingPrice": 5.0,
      "category": "antibiotic",
      "manufacturer": "Pfizer",
      "batchNumber": "BATCH-2024-013",
      "expiryDate": "2025-04-30",
      "status": "low_stock",
      "shelfLocation": "C-12"
    },
    {
      "medicineName": "Levothyroxine",
      "genericName": "Levothyroxine Sodium",
      "brandName": "Synthroid",
      "quantity": 120,
      "unit": "tablet",
      "reorderLevel": 40,
      "unitPrice": 2.75,
      "sellingPrice": 4.5,
      "category": "hormone",
      "manufacturer": "AbbVie",
      "batchNumber": "BATCH-2024-014",
      "expiryDate": "2025-10-31",
      "status": "available",
      "shelfLocation": "D-20"
    }
  ],
  "labTests": [
    {
      "patientEmail": "patient.john@example.com",
      "doctorEmail": "dr.smith@hopephysicians.com",
      "testName": "Complete Blood Count",
      "testType": "blood",
      "testCategory": "pathology",
      "status": "completed",
      "results": {
        "WBC": {
          "value": 7.2,
          "unit": "10^3/μL",
          "normalRange": "4.0-11.0",
          "abnormal": false
        },
        "RBC": {
          "value": 4.8,
          "unit": "10^6/μL",
          "normalRange": "4.5-5.5",
          "abnormal": false
        },
        "Hemoglobin": {
          "value": 14.5,
          "unit": "g/dL",
          "normalRange": "12.0-16.0",
          "abnormal": false
        }
      },
      "reportUrl": "/uploads/reports/lab-report-001.pdf"
    },
    {
      "patientEmail": "patient.sarah@example.com",
      "doctorEmail": "dr.johnson@hopephysicians.com",
      "testName": "Blood Glucose Test",
      "testType": "blood",
      "testCategory": "biochemistry",
      "status": "completed",
      "results": {
        "Fasting Glucose": {
          "value": 95,
          "unit": "mg/dL",
          "normalRange": "70-100",
          "abnormal": false
        },
        "HbA1c": {
          "value": 5.8,
          "unit": "%",
          "normalRange": "4.0-6.0",
          "abnormal": false
        }
      },
      "reportUrl": "/uploads/reports/lab-report-002.pdf"
    },
    {
      "patientEmail": "patient.robert@example.com",
      "doctorEmail": "dr.davis@hopephysicians.com",
      "testName": "Lipid Profile",
      "testType": "blood",
      "testCategory": "biochemistry",
      "status": "completed",
      "results": {
        "Total Cholesterol": {
          "value": 220,
          "unit": "mg/dL",
          "normalRange": "<200",
          "abnormal": true
        },
        "LDL": {
          "value": 150,
          "unit": "mg/dL",
          "normalRange": "<100",
          "abnormal": true
        },
        "HDL": {
          "value": 45,
          "unit": "mg/dL",
          "normalRange": ">40",
          "abnormal": false
        },
        "Triglycerides": {
          "value": 180,
          "unit": "mg/dL",
          "normalRange": "<150",
          "abnormal": true
        }
      },
      "reportUrl": "/uploads/reports/lab-report-003.pdf"
    },
    {
      "patientEmail": "patient.jessica@example.com",
      "doctorEmail": "dr.smith@hopephysicians.com",
      "testName": "Liver Function Test",
      "testType": "blood",
      "testCategory": "biochemistry",
      "status": "pending",
      "results": null,
      "reportUrl": null
    },
    {
      "patientEmail": "patient.mike@example.com",
      "doctorEmail": "dr.williams@hopephysicians.com",
      "testName": "Urine Culture",
      "testType": "urine",
      "testCategory": "microbiology",
      "status": "pending",
      "results": null,
      "reportUrl": null
    }
  ]
}
```

### Complete Seed Data Summary

**Doctors:** 5 doctors (Cardiology, General Medicine, Pediatrics, Orthopedics, Neurology)
**Patients:** 10 patients with complete profiles
**Appointments:** 10 appointments (various statuses: scheduled, confirmed, completed, cancelled)
**Prescriptions:** 8 prescriptions linked to appointments
**Bills:** 10 bills (5 paid, 3 unpaid, 2 partial)
**Lab Tests:** 5 lab tests (3 completed, 2 pending)
**Medicines:** 15 medicines (various categories, stock levels, expiry dates)
**Reminders:** 10 reminders (medication and appointment)
**Chat Messages:** 20 messages (patient-support conversations)
**Feedback:** 5 feedback entries (various ratings)

---

## Test Execution Checklist

### Pre-Testing Setup

- [ ] Database migrated and seeded
- [ ] All test users created
- [ ] Test data loaded
- [ ] Environment variables configured
- [ ] Payment gateway test keys set
- [ ] Email/SMS services configured (test mode)

### Module Testing Order

1. [ ] Admin Module (Foundation)
2. [ ] Staff Module (Reception, Nurse, Lab, Pharmacy)
3. [ ] Doctor Module
4. [ ] Patient Module

### Regression Testing

- [ ] Run all positive test cases
- [ ] Run all negative test cases
- [ ] Run edge cases
- [ ] Cross-module integration tests
- [ ] Performance testing
- [ ] Security testing

### Post-Testing

- [ ] Test results documented
- [ ] Bugs logged and prioritized
- [ ] Test coverage report generated
- [ ] Sign-off from QA team

---

## Test Automation Scripts (Sample)

### API Test Example (Using Jest/Supertest)

```javascript
// tests/api/patient/appointment.test.js
const request = require("supertest");
const app = require("../../server");

describe("Patient Appointment API", () => {
  let authToken;
  let patientId;

  beforeAll(async () => {
    // Login as patient
    const res = await request(app).post("/api/auth/login").send({
      email: "patient.john@example.com",
      password: "Patient@123",
    });
    authToken = res.body.token;
    patientId = res.body.user.patientId;
  });

  test("TC-P-001: Book Appointment Successfully", async () => {
    const response = await request(app)
      .post("/api/patient/appointments")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        doctorId: "doctor-id-here",
        date: "2024-12-25",
        time: "10:00 AM",
        type: "consultation",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("scheduled");
  });

  test("TC-N-001: Book Appointment When Doctor Unavailable", async () => {
    const response = await request(app)
      .post("/api/patient/appointments")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        doctorId: "unavailable-doctor-id",
        date: "2024-12-25",
        time: "10:00 AM",
        type: "consultation",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("not available");
  });
});
```

---

## Performance Test Scenarios

### Load Testing

- **Concurrent Users:** 100, 500, 1000
- **Test Duration:** 30 minutes
- **Scenarios:**
  - Multiple patients booking appointments simultaneously
  - Multiple staff accessing dashboard
  - Concurrent payment processing
  - Real-time chat with multiple users

### Stress Testing

- **Peak Load:** 2000 concurrent users
- **Test Scenarios:**
  - Database connection pool exhaustion
  - API rate limiting
  - File upload limits
  - Payment gateway timeout handling

---

## Security Test Scenarios

### Authentication & Authorization

- [ ] JWT token expiration handling
- [ ] Role-based access control
- [ ] Session timeout
- [ ] Password strength validation
- [ ] OTP verification (if implemented)

### Data Security

- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] File upload security
- [ ] Sensitive data encryption

### API Security

- [ ] Rate limiting
- [ ] Input validation
- [ ] Error message sanitization
- [ ] HTTPS enforcement

---

## Browser Compatibility Testing

### Supported Browsers

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Test Scenarios

- [ ] Responsive design on mobile
- [ ] Touch interactions
- [ ] File uploads on mobile
- [ ] Payment gateway on mobile
- [ ] Real-time chat on mobile

---

## Accessibility Testing

### WCAG 2.1 Compliance

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratios
- [ ] Alt text for images
- [ ] Form labels
- [ ] ARIA attributes

---

## Test Report Template

### Test Execution Summary

| Module            | Total Tests | Passed  | Failed | Blocked | Pass Rate |
| ----------------- | ----------- | ------- | ------ | ------- | --------- |
| Patient Dashboard | 50          | 45      | 3      | 2       | 90%       |
| Doctor Dashboard  | 40          | 38      | 2      | 0       | 95%       |
| Staff Dashboard   | 60          | 55      | 4      | 1       | 92%       |
| Admin Dashboard   | 30          | 28      | 2      | 0       | 93%       |
| **Total**         | **180**     | **166** | **11** | **3**   | **92%**   |

### Critical Bugs Found

1. Payment gateway timeout not handled properly
2. Appointment booking race condition
3. File upload size validation bypass

### Test Environment

- **Environment:** Staging
- **Database:** PostgreSQL (Test)
- **Date:** 2024-12-15
- **Tester:** QA Team
- **Build Version:** v1.0.0

---

## PART F – Patient Information Form Test Data

### Quick Copy-Paste Test Data for Patient Registration Form

Use this data to manually test the Patient Registration form. Each entry is ready to copy and paste into the form fields.

---

### Test Patient 1 - Complete Information (All Fields)

```
First Name: John
Last Name: Doe
Email: patient.test1@example.com
Phone: 555-0101
Date of Birth: 1985-05-15
Gender: Male
Street Address: 123 Main Street
City: New York
State: NY
Zip Code: 10001
Emergency Contact Name: Jane Doe
Emergency Contact Phone: 555-0102
Insurance Provider: BlueCross BlueShield
Insurance Number: BC123456789
```

---

### Test Patient 2 - Female Patient

```
First Name: Sarah
Last Name: Smith
Email: patient.test2@example.com
Phone: 555-0201
Date of Birth: 1990-08-22
Gender: Female
Street Address: 456 Oak Avenue
City: Los Angeles
State: CA
Zip Code: 90001
Emergency Contact Name: Mike Smith
Emergency Contact Phone: 555-0202
Insurance Provider: Aetna
Insurance Number: AE987654321
```

---

### Test Patient 3 - Without Insurance (Optional Fields Empty)

```
First Name: Michael
Last Name: Johnson
Email: patient.test3@example.com
Phone: 555-0301
Date of Birth: 1988-03-10
Gender: Male
Street Address: 789 Pine Road
City: Chicago
State: IL
Zip Code: 60601
Emergency Contact Name: Lisa Johnson
Emergency Contact Phone: 555-0302
Insurance Provider: (Leave empty)
Insurance Number: (Leave empty)
```

---

### Test Patient 4 - Young Adult

```
First Name: Emily
Last Name: Davis
Email: patient.test4@example.com
Phone: 555-0401
Date of Birth: 2000-11-05
Gender: Female
Street Address: 321 Elm Street
City: Houston
State: TX
Zip Code: 77001
Emergency Contact Name: Tom Davis
Emergency Contact Phone: 555-0402
Insurance Provider: UnitedHealthcare
Insurance Number: UH789123456
```

---

### Test Patient 5 - Senior Citizen

```
First Name: Robert
Last Name: Wilson
Email: patient.test5@example.com
Phone: 555-0501
Date of Birth: 1950-07-20
Gender: Male
Street Address: 654 Maple Drive
City: Phoenix
State: AZ
Zip Code: 85001
Emergency Contact Name: Mary Wilson
Emergency Contact Phone: 555-0502
Insurance Provider: Medicare
Insurance Number: MC321654987
```

---

### Test Patient 6 - Different State

```
First Name: Jessica
Last Name: Martinez
Email: patient.test6@example.com
Phone: 555-0601
Date of Birth: 1995-02-14
Gender: Female
Street Address: 987 Cedar Lane
City: Philadelphia
State: PA
Zip Code: 19101
Emergency Contact Name: Carlos Martinez
Emergency Contact Phone: 555-0602
Insurance Provider: Kaiser Permanente
Insurance Number: KA654321789
```

---

### Test Patient 7 - Long Names Test

```
First Name: Christopher
Last Name: Anderson-White
Email: patient.test7@example.com
Phone: 555-0701
Date of Birth: 1980-09-30
Gender: Male
Street Address: 147 Birch Way, Apartment 4B
City: San Antonio
State: TX
Zip Code: 78201
Emergency Contact Name: Susan Anderson-White
Emergency Contact Phone: 555-0702
Insurance Provider: Anthem Blue Cross
Insurance Number: AN987654321
```

---

### Test Patient 8 - Different Phone Format

```
First Name: Amanda
Last Name: Taylor
Email: patient.test8@example.com
Phone: (555) 080-1234
Date of Birth: 1987-12-25
Gender: Female
Street Address: 258 Spruce Avenue
City: San Diego
State: CA
Zip Code: 92101
Emergency Contact Name: James Taylor
Emergency Contact Phone: (555) 080-5678
Insurance Provider: Blue Shield
Insurance Number: BS147258369
```

---

### Test Patient 9 - Minimal Required Fields Only

```
First Name: Daniel
Last Name: White
Email: patient.test9@example.com
Phone: 555-0901
Date of Birth: 1984-01-12
Gender: Male
Street Address: 852 Poplar Court
City: Austin
State: TX
Zip Code: 78701
Emergency Contact Name: (Leave empty)
Emergency Contact Phone: (Leave empty)
Insurance Provider: (Leave empty)
Insurance Number: (Leave empty)
```

---

### Test Patient 10 - Other Gender Option

```
First Name: Alex
Last Name: Thompson
Email: patient.test10@example.com
Phone: 555-1001
Date of Birth: 1992-06-08
Gender: Other
Street Address: 741 Ash Boulevard
City: San Jose
State: CA
Zip Code: 95101
Emergency Contact Name: Sam Thompson
Emergency Contact Phone: 555-1002
Insurance Provider: Cigna
Insurance Number: CI369147258
```

---

### Test Patient 11 - International Format

```
First Name: Priya
Last Name: Patel
Email: patient.test11@example.com
Phone: +1-555-1101
Date of Birth: 1991-04-18
Gender: Female
Street Address: 369 Willow Street
City: Dallas
State: TX
Zip Code: 75201
Emergency Contact Name: Raj Patel
Emergency Contact Phone: +1-555-1102
Insurance Provider: Humana
Insurance Number: HU741852963
```

---

### Test Patient 12 - Edge Case: Very Long Address

```
First Name: William
Last Name: Brown
Email: patient.test12@example.com
Phone: 555-1201
Date of Birth: 1975-10-30
Gender: Male
Street Address: 1234 Very Long Street Name Apartment Complex Building A Unit 456
City: Miami
State: FL
Zip Code: 33101
Emergency Contact Name: Elizabeth Brown
Emergency Contact Phone: 555-1202
Insurance Provider: Tricare
Insurance Number: TR852963741
```

---

### Test Patient 13 - Edge Case: Special Characters in Name

```
First Name: José
Last Name: García-López
Email: patient.test13@example.com
Phone: 555-1301
Date of Birth: 1986-03-25
Gender: Male
Street Address: 456 Calle Principal
City: San Francisco
State: CA
Zip Code: 94101
Emergency Contact Name: María García
Emergency Contact Phone: 555-1302
Insurance Provider: Medicaid
Insurance Number: MD963741852
```

---

### Test Patient 14 - Edge Case: PO Box Address

```
First Name: Jennifer
Last Name: Lee
Email: patient.test14@example.com
Phone: 555-1401
Date of Birth: 1989-07-12
Gender: Female
Street Address: PO Box 1234
City: Seattle
State: WA
Zip Code: 98101
Emergency Contact Name: David Lee
Emergency Contact Phone: 555-1402
Insurance Provider: Regence BlueShield
Insurance Number: RB741852963
```

---

### Test Patient 15 - Edge Case: Multiple Middle Names

```
First Name: Robert
Last Name: James Michael O'Connor
Email: patient.test15@example.com
Phone: 555-1501
Date of Birth: 1983-12-05
Gender: Male
Street Address: 789 Heritage Drive
City: Boston
State: MA
Zip Code: 02101
Emergency Contact Name: Patricia O'Connor
Emergency Contact Phone: 555-1502
Insurance Provider: Tufts Health Plan
Insurance Number: TH852963741
```

---

### Validation Test Cases

#### Test Case 1: Duplicate Email (Should Fail)

Use Test Patient 1 data but change email to an existing one:

```
Email: patient.john@example.com (if already exists)
Expected: Error message "Email already exists"
```

#### Test Case 2: Invalid Email Format (Should Fail)

```
Email: invalid-email-format
Expected: Error message "Invalid email format"
```

#### Test Case 3: Invalid Phone Format (Should Fail)

```
Phone: 123 (too short)
Expected: Error message "Invalid phone number format"
```

#### Test Case 4: Future Date of Birth (Should Fail)

```
Date of Birth: 2025-12-31 (future date)
Expected: Error message "Date of birth cannot be in the future"
```

#### Test Case 5: Missing Required Fields (Should Fail)

Leave required fields empty:

- First Name: (empty)
- Last Name: (empty)
- Email: (empty)
- Phone: (empty)
  Expected: Validation errors for each required field

---

### Quick Reference Table

| Field                   | Required    | Format            | Example             |
| ----------------------- | ----------- | ----------------- | ------------------- |
| First Name              | ✅ Yes      | Text              | John                |
| Last Name               | ✅ Yes      | Text              | Doe                 |
| Email                   | ✅ Yes      | Email             | patient@example.com |
| Phone                   | ✅ Yes      | Phone             | 555-0101            |
| Date of Birth           | ⚠️ Optional | Date (YYYY-MM-DD) | 1985-05-15          |
| Gender                  | ⚠️ Optional | Dropdown          | Male/Female/Other   |
| Street Address          | ⚠️ Optional | Text              | 123 Main Street     |
| City                    | ⚠️ Optional | Text              | New York            |
| State                   | ⚠️ Optional | Text              | NY                  |
| Zip Code                | ⚠️ Optional | Text              | 10001               |
| Emergency Contact Name  | ⚠️ Optional | Text              | Jane Doe            |
| Emergency Contact Phone | ⚠️ Optional | Phone             | 555-0102            |
| Insurance Provider      | ⚠️ Optional | Text              | BlueCross           |
| Insurance Number        | ⚠️ Optional | Text              | BC123456789         |

---

### Tips for Testing

1. **Start with Test Patient 1** - Complete all fields to verify form works with full data
2. **Test Required Fields** - Try submitting with empty required fields
3. **Test Email Validation** - Try duplicate emails, invalid formats
4. **Test Phone Validation** - Try different phone formats
5. **Test Optional Fields** - Submit with only required fields filled
6. **Test Date Validation** - Try future dates, invalid dates
7. **Test Special Characters** - Use Test Patient 13 to test special characters
8. **Test Long Inputs** - Use Test Patient 12 to test address length limits
9. **Test Different Genders** - Use Test Patient 10 for "Other" gender option
10. **Test Edge Cases** - PO Box addresses, multiple names, etc.

---

## Conclusion

This comprehensive test document covers all aspects of testing for the Hospital Management System. Use this as a reference for:

- Manual testing execution
- Test automation script development
- Test case creation
- Bug reporting
- Test coverage analysis

**Next Steps:**

1. Set up test environment
2. Load seed data
3. Execute test cases
4. Document results
5. Fix bugs and retest
6. Sign off for production

---

**Document Version:** 1.0  
**Last Updated:** 2024-12-15  
**Maintained By:** QA Team
