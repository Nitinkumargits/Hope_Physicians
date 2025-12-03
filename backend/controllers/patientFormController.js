// controllers/patientFormController.js
const { prisma } = require('../src/lib/prisma.js');

const patientFormController = {
  // Submit patient information form
  submitPatientInfoForm: async (req, res) => {
    try {
      console.log('📝 Received Patient Information form submission:', {
        patientName: req.body.patientName,
        email: req.body.email || req.body.phoneMobile,
      });

      const formData = req.body;
      
      // Parse patient name into firstName and lastName
      let firstName = '';
      let lastName = '';
      if (formData.patientName) {
        const nameParts = formData.patientName.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Try to find existing patient by email or phone
      let patient = null;
      if (formData.email) {
        patient = await prisma.patient.findUnique({
          where: { email: formData.email },
        });
      }
      
      if (!patient && formData.phoneMobile) {
        patient = await prisma.patient.findFirst({
          where: { phone: formData.phoneMobile },
        });
      }

      // Create or update patient record
      const patientData = {
        firstName: firstName || formData.firstName || 'Unknown',
        lastName: lastName || formData.lastName || '',
        email: formData.email || `patient_${Date.now()}@temp.com`,
        phone: formData.phoneMobile || formData.phoneHome || '',
        dateOfBirth: formData.dob ? new Date(formData.dob) : null,
        gender: formData.gender,
        address: formData.address || formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zip,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
      };

      if (patient) {
        // Update existing patient
        patient = await prisma.patient.update({
          where: { id: patient.id },
          data: patientData,
        });
        console.log(`✅ Updated existing patient: ${patient.firstName} ${patient.lastName}`);
      } else {
        // Create new patient
        patient = await prisma.patient.create({
          data: {
            ...patientData,
            kycStatus: 'pending',
          },
        });
        console.log(`✅ Created new patient: ${patient.firstName} ${patient.lastName}`);
      }

      // Create form submission record
      const formSubmission = await prisma.patientFormSubmission.create({
        data: {
          formType: 'patient_info',
          patientId: patient.id,
          pharmacyName: formData.pharmacyName,
          patientName: formData.patientName,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: formData.dob ? new Date(formData.dob) : null,
          streetAddress: formData.address || formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          ssn: formData.ssn,
          phoneHome: formData.phoneHome,
          phoneMobile: formData.phoneMobile,
          employerPhone: formData.employerPhone,
          employerAddress: formData.employerAddress,
          employerCity: formData.employerCity,
          employerState: formData.employerState,
          employerZip: formData.employerZip,
          maritalStatus: formData.maritalStatus,
          migrantWorker: formData.migrantWorker,
          race: formData.race,
          gender: formData.gender,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          responsiblePartyName: formData.responsiblePartyName,
          responsiblePartyRelationship: formData.responsiblePartyRelationship,
          responsiblePartyPhone: formData.responsiblePartyPhone,
          policyNumber: formData.policyNumber,
          groupNumber: formData.groupNumber,
          signature: formData.signature,
          signatureDate: formData.signatureDate ? new Date(formData.signatureDate) : new Date(),
          formData: JSON.stringify(formData), // Store full form data as JSON
        },
      });

      console.log(`✅ Patient Information form submitted successfully (ID: ${formSubmission.id})`);

      return res.json({
        success: true,
        message: 'Patient Information form submitted successfully',
        data: {
          formSubmissionId: formSubmission.id,
          patientId: patient.id,
        },
      });
    } catch (error) {
      console.error('❌ Error submitting Patient Information form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit form. Please try again.',
        details: error.message,
      });
    }
  },

  // Submit privacy acknowledgement form
  submitPrivacyForm: async (req, res) => {
    try {
      console.log('📝 Received Privacy Acknowledgement form submission');

      const formData = req.body;

      // Try to find patient by name and DOB
      let patient = null;
      if (formData.privacyName && formData.privacyDob) {
        const nameParts = formData.privacyName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        patient = await prisma.patient.findFirst({
          where: {
            firstName: { contains: firstName },
            lastName: { contains: lastName },
            dateOfBirth: new Date(formData.privacyDob),
          },
        });
      }

      const formSubmission = await prisma.patientFormSubmission.create({
        data: {
          formType: 'privacy_ack',
          patientId: patient?.id || null,
          privacyName: formData.privacyName,
          privacyDob: formData.privacyDob ? new Date(formData.privacyDob) : null,
          privacySignature: formData.privacySignature,
          privacyDate: formData.privacyDate ? new Date(formData.privacyDate) : new Date(),
          privacyWitness: formData.privacyWitness,
          witnessDate: formData.witnessDate ? new Date(formData.witnessDate) : null,
          formData: JSON.stringify(formData),
        },
      });

      console.log(`✅ Privacy Acknowledgement form submitted successfully (ID: ${formSubmission.id})`);

      return res.json({
        success: true,
        message: 'Privacy Acknowledgement form submitted successfully',
        data: {
          formSubmissionId: formSubmission.id,
          patientId: patient?.id || null,
        },
      });
    } catch (error) {
      console.error('❌ Error submitting Privacy Acknowledgement form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit form. Please try again.',
        details: error.message,
      });
    }
  },

  // Submit parental consent form
  submitParentalConsentForm: async (req, res) => {
    try {
      console.log('📝 Received Parental Consent form submission');

      const formData = req.body;

      // Try to find patient by name
      let patient = null;
      if (formData.patientName) {
        const nameParts = formData.patientName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        patient = await prisma.patient.findFirst({
          where: {
            firstName: { contains: firstName },
            lastName: { contains: lastName },
          },
        });
      }

      const formSubmission = await prisma.patientFormSubmission.create({
        data: {
          formType: 'parental_consent',
          patientId: patient?.id || null,
          accountNumber: formData.accountNumber,
          authName1: formData.authName1,
          authPhone1: formData.authPhone1,
          authRelationship1: formData.authRelationship1,
          authName2: formData.authName2,
          authPhone2: formData.authPhone2,
          authRelationship2: formData.authRelationship2,
          expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : null,
          guardianName: formData.guardianName,
          guardianSignature: formData.guardianSignature,
          consentDate: formData.consentDate ? new Date(formData.consentDate) : new Date(),
          consentWitness: formData.witnessSignature,
          consentWitnessDate: formData.witnessDate ? new Date(formData.witnessDate) : null,
          formData: JSON.stringify(formData),
        },
      });

      console.log(`✅ Parental Consent form submitted successfully (ID: ${formSubmission.id})`);

      return res.json({
        success: true,
        message: 'Parental Consent form submitted successfully',
        data: {
          formSubmissionId: formSubmission.id,
          patientId: patient?.id || null,
        },
      });
    } catch (error) {
      console.error('❌ Error submitting Parental Consent form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit form. Please try again.',
        details: error.message,
      });
    }
  },

  // Submit release of information form
  submitReleaseInfoForm: async (req, res) => {
    try {
      console.log('📝 Received Release of Information form submission');

      const formData = req.body;

      // Try to find patient by name and DOB
      let patient = null;
      if (formData.patientName && formData.dob) {
        const nameParts = formData.patientName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        patient = await prisma.patient.findFirst({
          where: {
            firstName: { contains: firstName },
            lastName: { contains: lastName },
            dateOfBirth: new Date(formData.dob),
          },
        });
      }

      const formSubmission = await prisma.patientFormSubmission.create({
        data: {
          formType: 'release_info',
          patientId: patient?.id || null,
          authorizeFrom: formData.authorizeFrom,
          releaseTo: formData.releaseTo,
          faxAddress: formData.faxAddress,
          infoHistory: formData.infoHistory === 'on' || formData.infoHistory === true,
          infoProgress: formData.infoProgress === 'on' || formData.infoProgress === true,
          infoLab: formData.infoLab === 'on' || formData.infoLab === true,
          infoXray: formData.infoXray === 'on' || formData.infoXray === true,
          infoOther: formData.infoOther === 'on' || formData.infoOther === true,
          infoOtherSpecify: formData.infoOtherSpecify,
          infoEntire: formData.infoEntire === 'on' || formData.infoEntire === true,
          purposeChanging: formData.purposeChanging === 'on' || formData.purposeChanging === true,
          purposeConsult: formData.purposeConsult === 'on' || formData.purposeConsult === true,
          purposeContinuity: formData.purposeContinuity === 'on' || formData.purposeContinuity === true,
          purposeOther: formData.purposeOther === 'on' || formData.purposeOther === true,
          purposeOtherSpecify: formData.purposeOtherSpecify,
          releaseDate: formData.releaseDate ? new Date(formData.releaseDate) : new Date(),
          interim: formData.interim,
          insurance: formData.insurance,
          releaseExpirationDate: formData.expirationDate ? new Date(formData.expirationDate) : null,
          releasePatientSignature: formData.patientSignature,
          releaseSignatureDate: formData.signatureDate ? new Date(formData.signatureDate) : new Date(),
          authorizedAgentSignature: formData.authorizedAgentSignature,
          agentRelationship: formData.agentRelationship,
          agentDate: formData.agentDate ? new Date(formData.agentDate) : null,
          releaseWitness: formData.witnessSignature,
          releaseWitnessDate: formData.witnessDate ? new Date(formData.witnessDate) : null,
          formData: JSON.stringify(formData),
        },
      });

      console.log(`✅ Release of Information form submitted successfully (ID: ${formSubmission.id})`);

      return res.json({
        success: true,
        message: 'Release of Information form submitted successfully',
        data: {
          formSubmissionId: formSubmission.id,
          patientId: patient?.id || null,
        },
      });
    } catch (error) {
      console.error('❌ Error submitting Release of Information form:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit form. Please try again.',
        details: error.message,
      });
    }
  },

  // Get all form submissions for a patient
  getPatientFormSubmissions: async (req, res) => {
    try {
      const { patientId } = req.params;

      const submissions = await prisma.patientFormSubmission.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
      });

      return res.json({ data: submissions });
    } catch (error) {
      console.error('❌ Error fetching form submissions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = patientFormController;

