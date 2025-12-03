# Patient Form Setup Guide

## Overview
All patient forms on `/patient-form` are now fully dynamic and functional with backend and database integration.

## Forms Available

1. **Patient Information Form** (`patient-info`)
   - Stores comprehensive patient information
   - Creates or updates patient records
   - Links to existing patients by email/phone

2. **Privacy Practices Acknowledgement** (`privacy-ack`)
   - Stores privacy acknowledgement data
   - Links to patient records when found

3. **Parental Consent Form** (`parental-consent`)
   - Stores parental consent information
   - Links to patient records when found

4. **Authorization for Release of Information** (`release-info`)
   - Stores release authorization data
   - Links to patient records when found

## Database Schema

The `PatientFormSubmission` model stores all form data with:
- Form type identification
- Patient linking (optional)
- All form-specific fields
- JSON backup of complete form data
- Timestamps

## API Endpoints

### Submit Forms
- `POST /api/patient-forms/patient-info` - Submit Patient Information form
- `POST /api/patient-forms/privacy-ack` - Submit Privacy Acknowledgement form
- `POST /api/patient-forms/parental-consent` - Submit Parental Consent form
- `POST /api/patient-forms/release-info` - Submit Release of Information form

### Get Form Submissions
- `GET /api/patient-forms/patient/:patientId` - Get all form submissions for a patient

## Setup Instructions

### 1. Database Migration

Run the Prisma migration to create the `PatientFormSubmission` table:

```bash
cd backend
npx prisma db push
```

When prompted about warnings, type `y` to proceed.

### 2. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

**Note:** If you get a file lock error, stop the server first, then run the command.

### 3. Start the Server

```bash
cd backend
npm run dev
```

The server will automatically seed the database if needed.

## Features

✅ **All forms submit to backend**
✅ **Patient matching and creation**
✅ **Form validation**
✅ **Error handling**
✅ **Success/error notifications**
✅ **Loading states**
✅ **Database persistence**

## Testing

1. Navigate to `http://localhost:5173/patient-form`
2. Fill out any form
3. Submit the form
4. Check backend console for submission logs
5. Verify data in database using Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

## Form Data Flow

1. User fills out form on frontend
2. Form submits to backend API endpoint
3. Backend finds or creates patient record
4. Backend creates form submission record
5. Frontend shows success/error notification
6. Form resets on success

## Error Handling

- Network errors show user-friendly messages
- Validation errors are caught and displayed
- Backend errors are logged and returned to frontend
- All errors use React Hot Toast for notifications

