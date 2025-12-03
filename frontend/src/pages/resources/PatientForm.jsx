import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import '../../styles/Home.css';
import '../../styles/Forms.css';
import heroImg from "../../assets/images/hero2.jpg";
import patientFormService from '../../services/patientFormService';

const PatientForm = () => {
  const [activeForm, setActiveForm] = useState('patient-info');
  const [activeSubForm, setActiveSubForm] = useState('patient-info-form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
      <h1>Patient Forms</h1>
          <p className="subheading">
            Complete your forms before your visit to save time
          </p>
        </div>
      </section>

      {/* FORM SELECTOR */}
      <section className="section" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button
              onClick={() => setActiveForm('patient-info')}
              style={{
                padding: '12px 24px',
                background: activeForm === 'patient-info' ? '#004aad' : '#fff',
                color: activeForm === 'patient-info' ? '#fff' : '#004aad',
                border: '2px solid #004aad',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Patient Information & Privacy
            </button>
            <button
              onClick={() => setActiveForm('parental-consent')}
              style={{
                padding: '12px 24px',
                background: activeForm === 'parental-consent' ? '#004aad' : '#fff',
                color: activeForm === 'parental-consent' ? '#fff' : '#004aad',
                border: '2px solid #004aad',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Parental Consent
            </button>
            <button
              onClick={() => setActiveForm('release-info')}
              style={{
                padding: '12px 24px',
                background: activeForm === 'release-info' ? '#004aad' : '#fff',
                color: activeForm === 'release-info' ? '#fff' : '#004aad',
                border: '2px solid #004aad',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Authorization for Release of Information
            </button>
          </div>

          {/* PATIENT INFORMATION & PRIVACY FORM */}
          {activeForm === 'patient-info' && (
            <>
              {/* SUB-FORM SELECTOR */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
                <button
                  onClick={() => setActiveSubForm('patient-info-form')}
                  style={{
                    padding: '10px 20px',
                    background: activeSubForm === 'patient-info-form' ? '#004aad' : '#fff',
                    color: activeSubForm === 'patient-info-form' ? '#fff' : '#004aad',
                    border: '2px solid #004aad',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Patient Information
                </button>
                <button
                  onClick={() => setActiveSubForm('privacy-ack')}
                  style={{
                    padding: '10px 20px',
                    background: activeSubForm === 'privacy-ack' ? '#004aad' : '#fff',
                    color: activeSubForm === 'privacy-ack' ? '#fff' : '#004aad',
                    border: '2px solid #004aad',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Privacy Practices Acknowledgement
                </button>
              </div>

              {/* PATIENT INFORMATION FORM */}
              {activeSubForm === 'patient-info-form' && (
                <div className="appointment-box">
                  <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#004aad' }}>
                    HOPE PHYSICIANS & URGENT CARE, PLLC.
                  </h2>
                  <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                    2104 North Heritage St. • Kinston, NC 28501<br />
                    Office 252.522.3663 • Fax 252.522.3660
                  </p>
                  <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Patient Information</h3>

                  <form 
                    className="appointment-form"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      
                      const formData = new FormData(e.target);
                      const data = Object.fromEntries(formData.entries());
                      
                      // Get radio button values
                      const maritalStatus = formData.get('maritalStatus');
                      const migrantWorker = formData.get('migrantWorker');
                      const race = formData.get('race');
                      const gender = formData.get('gender');
                      
                      const submitData = {
                        ...data,
                        maritalStatus,
                        migrantWorker,
                        race,
                        gender,
                      };
                      
                      const result = await patientFormService.submitPatientInfoForm(submitData);
                      
                      setIsSubmitting(false);
                      
                      if (result.success) {
                        toast.success('Patient Information form submitted successfully!');
                        e.target.reset();
                      } else {
                        toast.error(result.error || 'Failed to submit form. Please try again.');
                      }
                    }}
                  >
                    <div className="form-group">
                      <label>Pharmacy Name</label>
                      <input type="text" name="pharmacyName" />
                    </div>

                    <div className="form-group">
                      <label>Email Address (for patient matching)</label>
                      <input type="email" name="email" placeholder="example@email.com" />
                    </div>

                    <div className="form-group">
                      <label>Patient Name (First MI Last) *</label>
                      <input type="text" name="patientName" placeholder="First Middle Last" required />
                    </div>

                    <div className="form-group">
                      <label>Date of Birth *</label>
                      <input type="date" name="dob" required />
                    </div>

                    <div className="form-group">
                      <label>Street Address *</label>
                      <input type="text" name="address" required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>City *</label>
                        <input type="text" name="city" required />
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <input type="text" name="state" required />
                      </div>
                      <div className="form-group">
                        <label>Zip Code *</label>
                        <input type="text" name="zip" required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Social Security Number</label>
                      <input type="text" name="ssn" placeholder="XXX-XX-XXXX" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>Home Phone</label>
                        <input type="tel" name="phoneHome" placeholder="(XXX) XXX-XXXX" />
                      </div>
                      <div className="form-group">
                        <label>Mobile Phone *</label>
                        <input type="tel" name="phoneMobile" placeholder="(XXX) XXX-XXXX" required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Employer Work Number</label>
                      <input type="tel" name="employerPhone" placeholder="(XXX) XXX-XXXX" />
                    </div>

                    <div className="form-group">
                      <label>Employer Address</label>
                      <input type="text" name="employerAddress" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>City</label>
                        <input type="text" name="employerCity" />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input type="text" name="employerState" />
                      </div>
                      <div className="form-group">
                        <label>Zip Code</label>
                        <input type="text" name="employerZip" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Marital Status *</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '8px' }}>
                        {['Minor', 'Married', 'Divorced', 'Widowed', 'Single', 'Separated'].map((status) => (
                          <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                            <input type="radio" name="maritalStatus" value={status.toLowerCase()} required />
                            {status}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Are you currently a Migrant or Seasonal Farm Worker? *</label>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                          <input type="radio" name="migrantWorker" value="yes" required />
                          Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                          <input type="radio" name="migrantWorker" value="no" required />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Race *</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '8px' }}>
                        {['Asian', 'Black', 'Hispanic', 'Native American', 'White', 'Other'].map((race) => (
                          <label key={race} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                            <input type="radio" name="race" value={race.toLowerCase()} required />
                            {race}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Gender *</label>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                        {['Male', 'Female', 'Other'].map((gender) => (
                          <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                            <input type="radio" name="gender" value={gender.toLowerCase()} required />
                            {gender}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>Emergency Contact Person *</label>
                        <input type="text" name="emergencyContact" required />
                      </div>
                      <div className="form-group">
                        <label>Phone *</label>
                        <input type="tel" name="emergencyPhone" placeholder="(XXX) XXX-XXXX" required />
                      </div>
                    </div>

                    <h4 style={{ marginTop: '30px', marginBottom: '20px', color: '#004aad' }}>Responsible Party</h4>
                    <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                      Name of person for this account.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="responsiblePartyName" />
                      </div>
                      <div className="form-group">
                        <label>Relationship to patient</label>
                        <input type="text" name="responsiblePartyRelationship" />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" name="responsiblePartyPhone" placeholder="(XXX) XXX-XXXX" />
                      </div>
                    </div>

                    <h4 style={{ marginTop: '30px', marginBottom: '20px', color: '#004aad' }}>Insurance Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>Policy #</label>
                        <input type="text" name="policyNumber" />
                      </div>
                      <div className="form-group">
                        <label>Group #</label>
                        <input type="text" name="groupNumber" />
                      </div>
                    </div>

                    <div style={{ marginTop: '30px', padding: '20px', background: '#f6f8fb', borderRadius: '10px' }}>
                      <p style={{ lineHeight: '1.8', fontSize: '14px', color: '#333', marginBottom: '15px' }}>
                        I authorize Hope Physicians and its assigns to provide treatment to: <strong>(patient's name)</strong>
                      </p>
                      <p style={{ lineHeight: '1.8', fontSize: '14px', color: '#333', marginBottom: '15px' }}>
                        I assign all benefit payments for services provided by Hope Physicians or its assigns directly to Hope Physicians. 
                        I assume financial responsibility for all treatments provided. This consent is valid until revoked in writing.
                      </p>
                    </div>

                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                          <label>Signature (patient/parent/legal guardian) *</label>
                          <input type="text" name="signature" placeholder="Type your full name" required />
                        </div>
                        <div className="form-group">
                          <label>Date *</label>
                          <input type="date" name="signatureDate" required />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginTop: '15px' }}>
                        <label>Office Use Only</label>
                        <input type="text" name="officeUse" disabled style={{ background: '#f0f0f0' }} />
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                      Serving All of Eastern North Carolina Since 2007
                    </div>

                    <button 
                      type="submit" 
                      className="form-btn" 
                      style={{ marginTop: '30px', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                  </form>
                </div>
              )}

              {/* PRIVACY PRACTICES ACKNOWLEDGEMENT FORM */}
              {activeSubForm === 'privacy-ack' && (
                <div className="appointment-box">
                  <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#004aad' }}>
                    HOPE PHYSICIANS & URGENT CARE, PLLC.
                  </h2>
                  <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                    2104 North Heritage St. • Kinston, NC 28501<br />
                    Office 252.522.3663 • Fax 252.522.3660
                  </p>
                  <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Privacy Practices Acknowledgement</h3>

                  <form 
                    className="appointment-form"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      
                      const formData = new FormData(e.target);
                      const data = Object.fromEntries(formData.entries());
                      
                      const result = await patientFormService.submitPrivacyForm(data);
                      
                      setIsSubmitting(false);
                      
                      if (result.success) {
                        toast.success('Privacy Acknowledgement form submitted successfully!');
                        e.target.reset();
                      } else {
                        toast.error(result.error || 'Failed to submit form. Please try again.');
                      }
                    }}
                  >
                    <div style={{ marginBottom: '30px', padding: '20px', background: '#f6f8fb', borderRadius: '10px' }}>
                      <p style={{ lineHeight: '1.8', fontSize: '14px', color: '#333' }}>
                        I have received and read the notice of privacy practices and I have been provided an opportunity to review it.
                      </p>
                    </div>

                    <div className="form-group">
                      <label>Name *</label>
                      <input type="text" name="privacyName" required />
                    </div>

                    <div className="form-group">
                      <label>Date of Birth *</label>
                      <input type="date" name="privacyDob" required />
                    </div>

                    <div className="form-group">
                      <label>Signature *</label>
                      <input type="text" name="privacySignature" placeholder="Type your full name" required />
                    </div>

                    <div className="form-group">
                      <label>Date *</label>
                      <input type="date" name="privacyDate" required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>Witness</label>
                        <input type="text" name="privacyWitness" />
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input type="date" name="witnessDate" />
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                      Serving All of Eastern North Carolina Since 2007
                    </div>

                    <button 
                      type="submit" 
                      className="form-btn" 
                      style={{ marginTop: '30px', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* PARENTAL CONSENT FORM */}
          {activeForm === 'parental-consent' && (
            <div className="appointment-box">
              <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#004aad' }}>
                HOPE PHYSICIANS & URGENT CARE, PLLC.
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                2104 North Heritage St. • Kinston, NC 28501<br />
                Office 252.522.3663 • Fax 252.522.3660
              </p>
              <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Parental Consent Form</h3>

              <form 
                className="appointment-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData.entries());
                  
                  const result = await patientFormService.submitParentalConsentForm(data);
                  
                  setIsSubmitting(false);
                  
                  if (result.success) {
                    toast.success('Parental Consent form submitted successfully!');
                    e.target.reset();
                  } else {
                    toast.error(result.error || 'Failed to submit form. Please try again.');
                  }
                }}
              >
                <h4 style={{ marginBottom: '20px', color: '#004aad' }}>Patient Information</h4>
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input type="text" name="patientName" required />
                </div>

                <div className="form-group">
                  <label>Account Number</label>
                  <input type="text" name="accountNumber" />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" name="address" required />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" name="phone" required />
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" name="dob" required />
                </div>

                <h4 style={{ marginTop: '30px', marginBottom: '20px', color: '#004aad' }}>Consent</h4>
                <div style={{ marginBottom: '30px', padding: '20px', background: '#f6f8fb', borderRadius: '10px', lineHeight: '1.8', fontSize: '14px', color: '#333' }}>
                  <p style={{ marginBottom: '15px' }}>
                    By signing below, I do hereby state that in my absence, the persons listed below may accompany my minor child listed above to any and all office visits at Hope Physicians in Kinston. I understand that the persons will be expected to present identification at each visit and remain in the room at all times during the visit.
                  </p>
                  <p style={{ marginBottom: '15px' }}>
                    By signing this statement, I also agree to give the listed persons access to my child's medical and financial information, and permission to make medical decisions as needed. This document may be revoked by the parent/legal guardian at any time by providing Hope Physicians of Kinston with the request to revoke in writing.
                  </p>
                  <p style={{ marginBottom: '0' }}>
                    The persons listed below must be 18 years of age or older and must present a valid government issued ID at the time of visit.
                  </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div className="form-group">
                      <label>Name *</label>
                      <input type="text" name="authName1" required />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input type="tel" name="authPhone1" required />
                    </div>
                    <div className="form-group">
                      <label>Relationship *</label>
                      <input type="text" name="authRelationship1" required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" name="authName2" />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" name="authPhone2" />
                    </div>
                    <div className="form-group">
                      <label>Relationship</label>
                      <input type="text" name="authRelationship2" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>This consent will be effective as of the date of the signature and will expire:</label>
                  <input type="date" name="expirationDate" />
                </div>

                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
                    <div className="form-group">
                      <label>Parent/Legal Guardian Printed *</label>
                      <input type="text" name="guardianName" required />
                    </div>
                    <div className="form-group">
                      <label>Parent/Legal Guardian Signature *</label>
                      <input type="text" name="guardianSignature" placeholder="Type your full name" required />
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input type="date" name="consentDate" required />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Witness</label>
                      <input type="text" name="witnessSignature" />
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input type="date" name="witnessDate" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="form-btn" 
                  style={{ marginTop: '30px', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </button>
              </form>
            </div>
          )}

          {/* AUTHORIZATION FOR RELEASE OF INFORMATION */}
          {activeForm === 'release-info' && (
            <div className="appointment-box">
              <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#004aad' }}>
                HOPE PHYSICIANS & URGENT CARE, PLLC.
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                2104 North Heritage St. • Kinston, NC 28501<br />
                Office 252.522.3663 • Fax 252.522.3660
              </p>
              <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Authorization for Release of Information</h3>

              <form 
                className="appointment-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData.entries());
                  
                  // Get checkbox values
                  const checkboxFields = [
                    'infoHistory', 'infoProgress', 'infoLab', 'infoXray', 'infoOther', 'infoEntire',
                    'purposeChanging', 'purposeConsult', 'purposeContinuity', 'purposeOther'
                  ];
                  
                  checkboxFields.forEach(field => {
                    data[field] = formData.get(field) === 'on' || formData.get(field) === true;
                  });
                  
                  const result = await patientFormService.submitReleaseInfoForm(data);
                  
                  setIsSubmitting(false);
                  
                  if (result.success) {
                    toast.success('Release of Information form submitted successfully!');
                    e.target.reset();
                  } else {
                    toast.error(result.error || 'Failed to submit form. Please try again.');
                  }
                }}
              >
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input type="text" name="patientName" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input type="date" name="dob" required />
                  </div>
                  <div className="form-group">
                    <label>Social Security Number</label>
                    <input type="text" name="ssn" placeholder="XXX-XX-XXXX" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" name="address" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input type="text" name="state" required />
                  </div>
                  <div className="form-group">
                    <label>Zip Code *</label>
                    <input type="text" name="zip" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Phone (Home)</label>
                    <input type="tel" name="phoneHome" placeholder="(XXX) XXX-XXXX" />
                  </div>
                  <div className="form-group">
                    <label>Phone (Mobile) *</label>
                    <input type="tel" name="phoneMobile" placeholder="(XXX) XXX-XXXX" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>I hereby authorize *</label>
                  <input type="text" name="authorizeFrom" defaultValue="Hope Physicians & Urgent Care, PLLC." required />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    (Provider/Organization releasing information)
                  </small>
                </div>

                <div className="form-group">
                  <label>to release information from my medical record as indicated below to: *</label>
                  <input type="text" name="releaseTo" placeholder="Name of person/organization receiving information" required />
                </div>

                <div className="form-group">
                  <label>By mail or fax: (252) 522-3660 *</label>
                  <input type="text" name="faxAddress" placeholder="Mailing address or fax number" required />
                </div>

                <div className="form-group">
                  <label style={{ marginBottom: '15px', display: 'block' }}>Information to be released: *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="infoHistory" />
                      History and Physical Exams
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="infoProgress" />
                      Progress Notes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="infoLab" />
                      Lab Reports
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="infoXray" />
                      X-ray Reports
                    </label>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                        <input type="checkbox" name="infoOther" />
                        Other (please specify)
                      </label>
                      <input 
                        type="text" 
                        name="infoOtherSpecify" 
                        placeholder="Please specify" 
                        style={{ marginTop: '8px', marginLeft: '28px', width: 'calc(100% - 28px)', padding: '10px', border: '1px solid #dcdcdc', borderRadius: '8px' }}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="infoEntire" />
                      Entire Medical Record
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>I specifically authorize the Release of Information relating to: *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="purposeChanging" />
                      Changing Physicians
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="purposeConsult" />
                      Consult/Second Opinion
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="purposeContinuity" />
                      Continuity of Care
                    </label>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                        <input type="checkbox" name="purposeOther" />
                        Other (please specify)
                      </label>
                      <input 
                        type="text" 
                        name="purposeOtherSpecify" 
                        placeholder="Please specify" 
                        style={{ marginTop: '8px', marginLeft: '28px', width: 'calc(100% - 28px)', padding: '10px', border: '1px solid #dcdcdc', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" name="releaseDate" required />
                  </div>
                  <div className="form-group">
                    <label>Interim</label>
                    <input type="text" name="interim" />
                  </div>
                  <div className="form-group">
                    <label>Insurance</label>
                    <input type="text" name="insurance" placeholder="Legal School" />
                  </div>
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#f6f8fb', borderRadius: '10px' }}>
                  <h4 style={{ marginBottom: '15px' }}>Important Information:</h4>
                  <div style={{ marginBottom: '20px' }}>
                    <div className="form-group">
                      <label>Expiration Date *</label>
                      <input type="date" name="expirationDate" required />
                      <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        (Default: One year from signature date unless otherwise specified)
                      </small>
                    </div>
                  </div>
                  <ol style={{ paddingLeft: '20px', fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                    <li style={{ marginBottom: '10px' }}>
                      I understand that this information will expire one year from the date I have signed this form, unless otherwise specified.
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      I understand that I may revoke this authorization at any time by notifying the providing organization in writing and it will be effective on the date notified except to the extent action has already been taken care upon it.
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      I understand the information used or disclosed pursuant to the authorization may be subject to re-disclosure by the recipient and no longer be protected by Federal Privacy regulations.
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      I understand that my health care and payment for my health care will not be affected if I do not sign this form.
                    </li>
                  </ol>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ marginBottom: '20px', color: '#004aad' }}>Signature of Patient or Legal Guardian</h4>
                  
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div className="form-group">
                        <label>Signature of Patient *</label>
                        <input type="text" name="patientSignature" placeholder="Type your full name" required />
                      </div>
                      <div className="form-group">
                        <label>Date *</label>
                        <input type="date" name="signatureDate" required />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>Signature of Authorized Agent</label>
                        <input type="text" name="authorizedAgentSignature" placeholder="If applicable" />
                      </div>
                      <div className="form-group">
                        <label>Relationship to patient</label>
                        <input type="text" name="agentRelationship" placeholder="e.g., Parent, Guardian" />
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input type="date" name="agentDate" />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                      <div className="form-group">
                        <label>Witness</label>
                        <input type="text" name="witnessSignature" placeholder="Witness signature" />
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input type="date" name="witnessDate" />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                  <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                    Serving All of Eastern North Carolina Since 2007
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="form-btn" 
                  style={{ marginTop: '30px', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PatientForm;
