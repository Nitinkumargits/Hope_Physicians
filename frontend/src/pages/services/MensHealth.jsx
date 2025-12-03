import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Men's Health (Male patient consultation)
const mensImg = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=90&auto=format&fit=crop";

const MensHealth = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${mensImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Men's Health</h1>
          <p className="subheading">
            Preventive and specialized healthcare services tailored for men
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
                Comprehensive Men's Healthcare
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
                  Our Men's Health department provides specialized medical care addressing 
                  the unique health needs of men at every stage of life. We focus on preventive care, 
                  early detection, and treatment of conditions that commonly affect men.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our experienced physicians understand men's health concerns and provide 
                  confidential, compassionate care in a comfortable environment.
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
            Comprehensive men's health services for optimal wellness
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-body">
                <h3>Annual Physical Exams</h3>
                <p>Comprehensive health screenings, blood work, and preventive care assessments.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Prostate Health</h3>
                <p>Prostate screenings, PSA testing, and management of prostate-related conditions.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Cardiovascular Health</h3>
                <p>Heart health assessments, cholesterol management, and cardiovascular risk evaluation.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Hormone Therapy</h3>
                <p>Testosterone level testing and hormone replacement therapy when appropriate.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Sexual Health</h3>
                <p>Confidential evaluation and treatment of sexual health concerns and erectile dysfunction.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Mental Health Support</h3>
                <p>Counseling and support for stress, anxiety, depression, and mental wellness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Why Choose Our Men's Health Services?</h2>
          <div className="about-features" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="feature-box">
              <div className="feature-icon">🔒</div>
              <div>
                <h3>Confidential Care</h3>
                <p>Private, confidential consultations in a comfortable, judgment-free environment.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🎯</div>
              <div>
                <h3>Preventive Focus</h3>
                <p>Early detection and prevention of common men's health issues through regular screenings.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💪</div>
              <div>
                <h3>Comprehensive Approach</h3>
                <p>Addressing physical, mental, and emotional health needs specific to men.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <div>
                <h3>Expert Care</h3>
                <p>Experienced physicians specializing in men's health and wellness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Take Charge of Your Health Today</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Schedule your men's health screening or consultation with our team.</p>
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

export default MensHealth;
