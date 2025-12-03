// routes/patientFormRoutes.js
const express = require('express');
const router = express.Router();
const patientFormController = require('../controllers/patientFormController');

// Patient form submission routes
router.post('/patient-info', patientFormController.submitPatientInfoForm);
router.post('/privacy-ack', patientFormController.submitPrivacyForm);
router.post('/parental-consent', patientFormController.submitParentalConsentForm);
router.post('/release-info', patientFormController.submitReleaseInfoForm);
router.get('/patient/:patientId', patientFormController.getPatientFormSubmissions);

module.exports = router;

