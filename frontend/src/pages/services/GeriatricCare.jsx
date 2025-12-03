import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Geriatric Care (Senior care)
const geriatricImg = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=90&auto=format&fit=crop";

const GeriatricCare = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${geriatricImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Geriatric Care</h1>
          <p className="subheading">
            Holistic senior care and chronic disease management for older adults
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
                Comprehensive Senior Healthcare
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
                  Our Geriatric Care department specializes in providing comprehensive, 
                  compassionate healthcare for older adults. We understand the unique health 
                  challenges that come with aging and provide specialized care to help seniors 
                  maintain their independence and quality of life.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our geriatric specialists focus on managing multiple chronic conditions, 
                  preventing complications, and coordinating care to ensure the best outcomes for our senior patients.
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
            Comprehensive geriatric care services for healthy aging
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-body">
                <h3>Comprehensive Geriatric Assessments</h3>
                <p>Thorough evaluations of physical, cognitive, and functional health for seniors.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Chronic Disease Management</h3>
                <p>Expert management of diabetes, hypertension, heart disease, arthritis, and other chronic conditions.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Medication Management</h3>
                <p>Review and optimization of medications to prevent interactions and side effects.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Memory & Cognitive Care</h3>
                <p>Evaluation and management of dementia, Alzheimer's, and cognitive decline.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Fall Prevention</h3>
                <p>Assessments and interventions to reduce fall risk and improve mobility and balance.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Care Coordination</h3>
                <p>Coordination with specialists, home health services, and family caregivers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Why Choose Our Geriatric Care Services?</h2>
          <div className="about-features" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="feature-box">
              <div className="feature-icon">👴</div>
              <div>
                <h3>Age-Specialized Care</h3>
                <p>Physicians trained in geriatric medicine who understand the unique needs of older adults.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💊</div>
              <div>
                <h3>Medication Expertise</h3>
                <p>Careful management of multiple medications to ensure safety and effectiveness.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🏠</div>
              <div>
                <h3>Holistic Approach</h3>
                <p>Addressing physical, mental, emotional, and social aspects of aging and health.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🤝</div>
              <div>
                <h3>Family Involvement</h3>
                <p>Working with families and caregivers to provide comprehensive support and care coordination.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Schedule a Geriatric Care Consultation</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Book an appointment with our geriatric care specialists today.</p>
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

export default GeriatricCare;
