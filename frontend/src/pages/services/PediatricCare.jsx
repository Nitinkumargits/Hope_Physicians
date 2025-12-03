import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Pediatric Care (Child with doctor)
const pediatricsImg = "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&q=90&auto=format&fit=crop";

const PediatricCare = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${pediatricsImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Pediatric Care</h1>
          <p className="subheading">
            Compassionate, specialized healthcare for infants, children, and adolescents
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
                Specialized Care for Children
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
                  Our Pediatric Care department is dedicated to providing comprehensive, 
                  age-appropriate medical care for children from birth through adolescence. 
                  We understand that children have unique healthcare needs and require specialized attention.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our pediatric specialists are trained to address the physical, emotional, 
                  and developmental needs of young patients in a warm, child-friendly environment.
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
            Comprehensive pediatric services for your child's health and development
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-body">
                <h3>Well-Child Visits</h3>
                <p>Regular check-ups, growth monitoring, developmental assessments, and age-appropriate screenings.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Vaccinations</h3>
                <p>Complete immunization schedules following CDC guidelines to protect your child from preventable diseases.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Acute Illness Care</h3>
                <p>Treatment for common childhood illnesses, infections, fevers, and respiratory conditions.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Developmental Screening</h3>
                <p>Early detection and intervention for developmental delays, learning disabilities, and behavioral concerns.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Chronic Condition Management</h3>
                <p>Specialized care for asthma, allergies, diabetes, ADHD, and other chronic pediatric conditions.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>Parent Education</h3>
                <p>Guidance on nutrition, safety, sleep, behavior, and healthy development for your child.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Why Choose Our Pediatric Care?</h2>
          <div className="about-features" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="feature-box">
              <div className="feature-icon">👶</div>
              <div>
                <h3>Child-Friendly Environment</h3>
                <p>Our clinic is designed to make children feel comfortable and safe during their visits.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">👨‍⚕️</div>
              <div>
                <h3>Pediatric Specialists</h3>
                <p>Board-certified pediatricians with expertise in child health and development.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Growth Monitoring</h3>
                <p>Regular tracking of your child's growth, development, and milestones to ensure healthy progress.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🛡️</div>
              <div>
                <h3>Preventive Focus</h3>
                <p>Emphasis on preventive care, vaccinations, and early intervention to keep children healthy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Schedule Your Child's Next Visit</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Book an appointment with our pediatric care team today.</p>
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

export default PediatricCare;
