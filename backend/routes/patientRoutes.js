// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Patient routes
router.get('/:id', patientController.getPatientById);
router.get('/', patientController.getAllPatients);

module.exports = router;

