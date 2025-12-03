import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Family Medicine (Doctor with family)
const familyImg = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1920&q=90&auto=format&fit=crop";

const FamilyMedicine = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${familyImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Family Medicine</h1>
          <p className="subheading">
            Comprehensive primary healthcare for individuals and families of all ages
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="about-wrapper" style={{ gridTemplateColumns: '1fr', display: 'block' }}>
            <div className="about-content" style={{ 
              maxWidth: '900px', 
              margin: '0 auto',
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <h2 className="section-title" style={{ 
                fontSize: '36px',
                color: '#004aad',
                marginBottom: '24px',
                fontWeight: '700',
                lineHeight: '1.2'
              }}>
                Comprehensive Family Healthcare
              </h2>
              <div style={{ 
                textAlign: 'left',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '20px',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  At Hope Physicians, our Family Medicine department provides comprehensive, 
                  patient-centered primary care for individuals and families across all stages of life. 
                  We focus on preventive care, health maintenance, and the treatment of acute and chronic conditions.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our experienced family physicians serve as your primary healthcare partners, 
                  coordinating care and building long-term relationships with you and your family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OFFERED */}
      <section className="section" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <h2 className="section-title center">Services We Offer</h2>
          <p className="section-subtitle center">
            Comprehensive medical care tailored to your family's needs
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-body">
                <h3>Preventive Care</h3>
                <p>Annual physicals, health screenings, immunizations, and wellness exams to keep your family healthy.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Chronic Disease Management</h3>
                <p>Expert management of diabetes, hypertension, heart disease, and other chronic conditions.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Acute Care</h3>
                <p>Treatment for common illnesses, infections, injuries, and urgent medical concerns.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Health Counseling</h3>
                <p>Nutrition guidance, lifestyle modifications, and patient education for better health outcomes.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Minor Procedures</h3>
                <p>In-office procedures including suturing, mole removal, and other minor surgical procedures.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Care Coordination</h3>
                <p>Referrals to specialists and coordination of care across multiple healthcare providers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Why Choose Our Family Medicine Services?</h2>
          <div className="about-features" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="feature-box">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <div>
                <h3>Whole Family Care</h3>
                <p>One physician for your entire family, building lasting relationships and understanding your family's health history.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🩺</div>
              <div>
                <h3>Comprehensive Approach</h3>
                <p>We address physical, mental, and emotional health needs for patients of all ages.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">⏰</div>
              <div>
                <h3>Convenient Access</h3>
                <p>Easy scheduling, same-day appointments for urgent needs, and extended hours for your convenience.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💊</div>
              <div>
                <h3>Preventive Focus</h3>
                <p>Emphasis on preventive care and early detection to maintain optimal health and prevent complications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Ready to Schedule Your Family's Healthcare?</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Book an appointment with our family medicine team today.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <a href="/appointment" className="cta-btn" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '14px 24px',
              minWidth: '160px'
            }}>
              <span style={{ fontWeight: '700', fontSize: '16px' }}>Book</span>
              <span style={{ fontWeight: '700', fontSize: '16px' }}>Appointment</span>
            </a>
            <Link 
              to="/contact" 
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 22px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontWeight: '600',
                minWidth: '140px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Contact</span>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FamilyMedicine;
