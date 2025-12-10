// Test script for patient forms API endpoints
// Run with: node test-patient-forms.js

const http = require('http');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testPatientInfo = {
  pharmacyName: 'Test Pharmacy',
  email: 'test@example.com',
  patientName: 'John Doe',
  dob: '1990-01-15',
  address: '123 Test Street',
  city: 'Kinston',
  state: 'NC',
  zip: '28501',
  phoneHome: '(252) 555-0101',
  phoneMobile: '(252) 555-0102',
  maritalStatus: 'single',
  migrantWorker: 'no',
  race: 'white',
  gender: 'male',
  emergencyContact: 'Jane Doe',
  emergencyPhone: '(252) 555-0103',
  signature: 'John Doe',
  signatureDate: '2024-01-15'
};

const testPrivacyAck = {
  privacyName: 'John Doe',
  privacyDob: '1990-01-15',
  privacySignature: 'John Doe',
  privacyDate: '2024-01-15'
};

const testParentalConsent = {
  patientName: 'Child Doe',
  accountNumber: 'ACC123',
  address: '123 Test Street',
  phone: '(252) 555-0104',
  dob: '2010-05-20',
  authName1: 'Parent Doe',
  authPhone1: '(252) 555-0105',
  authRelationship1: 'Parent',
  guardianName: 'Parent Doe',
  guardianSignature: 'Parent Doe',
  consentDate: '2024-01-15'
};

const testReleaseInfo = {
  patientName: 'John Doe',
  dob: '1990-01-15',
  address: '123 Test Street',
  city: 'Kinston',
  state: 'NC',
  zip: '28501',
  phoneMobile: '(252) 555-0102',
  authorizeFrom: 'Hope Physicians & Urgent Care, PLLC.',
  releaseTo: 'Test Organization',
  faxAddress: '(252) 522-3660',
  infoHistory: true,
  infoProgress: true,
  purposeChanging: true,
  releaseDate: '2024-01-15',
  expirationDate: '2025-01-15',
  patientSignature: 'John Doe',
  signatureDate: '2024-01-15'
};

function makeRequest(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: { error: body } });
        }
      });
    });

    req.on('error', (e) => {
      if (e.code === 'ECONNREFUSED') {
        reject(new Error('Backend server not running on port 5000'));
      } else {
        reject(e);
      }
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

async function testEndpoint(name, endpoint, data) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    const response = await makeRequest('POST', endpoint, data);
    
    if (response.status === 200 && response.data.success) {
      console.log(`✅ ${name} - SUCCESS`);
      console.log(`   Form Submission ID: ${response.data.data?.formSubmissionId}`);
      console.log(`   Patient ID: ${response.data.data?.patientId || 'None (new patient)'}`);
      return true;
    } else {
      console.log(`❌ ${name} - FAILED: ${response.data.error || response.data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    if (error.message.includes('not running')) {
      console.log(`❌ ${name} - FAILED: ${error.message}`);
      console.log(`   Please start the backend server with: cd backend && npm run dev`);
    } else {
      console.log(`❌ ${name} - FAILED: ${error.message}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('PATIENT FORMS API TEST SUITE');
  console.log('='.repeat(60));
  
  const results = {
    patientInfo: await testEndpoint(
      'Patient Information Form',
      '/patient-forms/patient-info',
      testPatientInfo
    ),
    privacyAck: await testEndpoint(
      'Privacy Acknowledgement Form',
      '/patient-forms/privacy-ack',
      testPrivacyAck
    ),
    parentalConsent: await testEndpoint(
      'Parental Consent Form',
      '/patient-forms/parental-consent',
      testParentalConsent
    ),
    releaseInfo: await testEndpoint(
      'Release of Information Form',
      '/patient-forms/release-info',
      testReleaseInfo
    )
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Patient Information: ${results.patientInfo ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Privacy Acknowledgement: ${results.privacyAck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Parental Consent: ${results.parentalConsent ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Release of Information: ${results.releaseInfo ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r === true);
  console.log(`\nOverall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('='.repeat(60));
  
  process.exit(allPassed ? 0 : 1);
}

runTests();
