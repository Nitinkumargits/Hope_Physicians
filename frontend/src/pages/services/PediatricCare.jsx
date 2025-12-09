import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Pediatric Care (Child with doctor)
const pediatricsImg = "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&q=90&auto=format&fit=crop";

const pediatricServices = [
  {
    key: 'well-child',
    title: 'Well-Child Visits',
    desc: 'Regular check-ups, growth monitoring, developmental assessments, and age-appropriate screenings.',
    icon: 'clock',
  },
  {
    key: 'vaccinations',
    title: 'Vaccinations',
    desc: 'Complete immunization schedules following CDC guidelines to protect your child from preventable diseases.',
    icon: 'shield',
  },
  {
    key: 'acute',
    title: 'Acute Illness Care',
    desc: 'Treatment for common childhood illnesses, infections, fevers, and respiratory conditions.',
    icon: 'stethoscope',
  },
  {
    key: 'developmental',
    title: 'Developmental Screening',
    desc: 'Early detection and intervention for developmental delays, learning disabilities, and behavioral concerns.',
    icon: 'puzzle',
  },
  {
    key: 'chronic',
    title: 'Chronic Condition Management',
    desc: 'Specialized care for asthma, allergies, diabetes, ADHD, and other chronic pediatric conditions.',
    icon: 'heart',
  },
  {
    key: 'education',
    title: 'Parent Education',
    desc: 'Guidance on nutrition, safety, sleep, behavior, and healthy development for your child.',
    icon: 'book',
  },
];

const renderServiceIcon = (icon) => {
  const stroke = '#a5b4fc';
  switch (icon) {
    case 'clock':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
          <path d="m9.5 12.5 2 2 3-4" />
        </svg>
      );
    case 'stethoscope':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4v5a5 5 0 0 0 10 0V4" />
          <path d="M8 15a6 6 0 0 0 12 0v-3" />
          <circle cx="18" cy="10" r="2" />
        </svg>
      );
    case 'puzzle':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4h5v4a2 2 0 1 1-4 0H4Z" />
          <path d="M15 4h5v5h-4a2 2 0 1 1-1-4V4Z" />
          <path d="M4 15h4a2 2 0 1 1 4 0v4H4Z" />
          <path d="M14 15a2 2 0 1 1 4 0v4h-5v-4Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
        </svg>
      );
    case 'book':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20" />
          <path d="M6.5 7A2.5 2.5 0 0 0 4 9.5v10A2.5 2.5 0 0 1 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5" />
        </svg>
      );
    default:
      return null;
  }
};

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
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-8 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Pediatric Care
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Services We Offer</h2>
            <p className="text-slate-200 text-lg leading-relaxed">
              Comprehensive pediatric services for your child's health and development
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pediatricServices.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  {renderServiceIcon(service.icon)}
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  {service.title}
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  {service.desc}
                </p>
              </div>
            ))}
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
