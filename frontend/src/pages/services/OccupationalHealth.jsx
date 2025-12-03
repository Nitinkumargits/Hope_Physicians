import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality hospital-related image from Unsplash - Medical facility/hospital setting
const occupationalImg = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=90&auto=format&fit=crop";

const OccupationalHealth = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${occupationalImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Occupational Health</h1>
          <p className="subheading">
            Workplace health programs and screenings for employees and employers
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
                Workplace Health & Safety
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
                  Our Occupational Health department provides comprehensive workplace health services 
                  designed to keep employees healthy, safe, and productive. We work with both employers 
                  and employees to create healthier work environments.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our services include pre-employment screenings, workplace injury management, 
                  health surveillance programs, and wellness initiatives tailored to your industry.
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
            Comprehensive occupational health services for businesses and employees
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-body">
                <h3>Pre-Employment Screenings</h3>
                <p>Physical exams, drug testing, and health assessments for new hires.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Workplace Injury Care</h3>
                <p>Treatment and management of work-related injuries and occupational illnesses.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Health Surveillance Programs</h3>
                <p>Regular health monitoring for employees exposed to workplace hazards.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Fitness-for-Duty Exams</h3>
                <p>Assessments to determine an employee's ability to perform job duties safely.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Wellness Programs</h3>
                <p>Workplace wellness initiatives, health education, and preventive care programs.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Return-to-Work Evaluations</h3>
                <p>Assessments to safely return employees to work after injury or illness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Why Choose Our Occupational Health Services?</h2>
          <div className="about-features" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="feature-box">
              <div className="feature-icon">🏢</div>
              <div>
                <h3>Business-Focused</h3>
                <p>Services designed to reduce workplace injuries, improve productivity, and support compliance.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <div>
                <h3>Efficient Service</h3>
                <p>Streamlined processes and quick turnaround times to minimize workplace disruption.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📋</div>
              <div>
                <h3>Compliance Support</h3>
                <p>Help meeting OSHA and industry-specific health and safety regulations.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🤝</div>
              <div>
                <h3>Partnership Approach</h3>
                <p>Working closely with employers to develop customized health and safety programs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Partner With Us for Workplace Health</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Contact us to learn more about our occupational health services for your business.</p>
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

export default OccupationalHealth;
