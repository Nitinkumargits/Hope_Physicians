import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Women's Health (Female patient with doctor)
const womensImg = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=90&auto=format&fit=crop";

const WomensHealth = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${womensImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Women's Health</h1>
          <p className="subheading">
            Comprehensive gynecological and maternal health services for women
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
                Comprehensive Women's Healthcare
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
                  Our Women's Health department provides specialized medical care addressing 
                  the unique health needs of women throughout all stages of life. We offer 
                  comprehensive gynecological services, reproductive health care, and maternal health support.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our compassionate team of women's health specialists provides personalized, 
                  confidential care in a supportive and comfortable environment.
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
            Comprehensive women's health services for every stage of life
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-body">
                <h3>Annual Well-Woman Exams</h3>
                <p>Comprehensive gynecological exams, Pap smears, breast exams, and preventive screenings.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Reproductive Health</h3>
                <p>Contraception counseling, family planning, fertility evaluations, and preconception care.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Prenatal & Postnatal Care</h3>
                <p>Comprehensive maternity care, prenatal visits, and postpartum support for new mothers.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Menopause Management</h3>
                <p>Support and treatment for menopausal symptoms, hormone therapy, and bone health.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Gynecological Conditions</h3>
                <p>Treatment for PCOS, endometriosis, fibroids, and other gynecological conditions.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Breast Health</h3>
                <p>Breast exams, mammography referrals, and breast health education and support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Why Choose Our Women's Health Services?</h2>
          <div className="about-features" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="feature-box">
              <div className="feature-icon">🌸</div>
              <div>
                <h3>Compassionate Care</h3>
                <p>Understanding, supportive care in a comfortable, women-centered environment.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">👩‍⚕️</div>
              <div>
                <h3>Women's Health Specialists</h3>
                <p>Experienced gynecologists and women's health providers dedicated to your wellness.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🔒</div>
              <div>
                <h3>Confidential & Private</h3>
                <p>Respectful, confidential consultations addressing all your health concerns.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💝</div>
              <div>
                <h3>Holistic Approach</h3>
                <p>Comprehensive care addressing physical, emotional, and reproductive health needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Schedule Your Women's Health Appointment</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Book a consultation with our women's health specialists today.</p>
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

export default WomensHealth;
