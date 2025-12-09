import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Geriatric Care (Senior care)
const geriatricImg = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=90&auto=format&fit=crop";

const geriatricServices = [
  {
    key: 'assessment',
    title: 'Comprehensive Geriatric Assessments',
    desc: 'Thorough evaluations of physical, cognitive, and functional health for seniors.',
    icon: 'steth',
  },
  {
    key: 'chronic',
    title: 'Chronic Disease Management',
    desc: 'Expert management of diabetes, hypertension, heart disease, arthritis, and other chronic conditions.',
    icon: 'heart',
  },
  {
    key: 'meds',
    title: 'Medication Management',
    desc: 'Review and optimization of medications to prevent interactions and side effects.',
    icon: 'pill',
  },
  {
    key: 'memory',
    title: 'Memory & Cognitive Care',
    desc: "Evaluation and management of dementia, Alzheimer's, and cognitive decline.",
    icon: 'brain',
  },
  {
    key: 'falls',
    title: 'Fall Prevention',
    desc: 'Assessments and interventions to reduce fall risk and improve mobility and balance.',
    icon: 'shield',
  },
  {
    key: 'coordination',
    title: 'Care Coordination',
    desc: 'Coordination with specialists, home health services, and family caregivers.',
    icon: 'handshake',
  },
];

const geriatricWhy = [
  {
    key: 'age',
    title: 'Age-Specialized Care',
    copy: 'Physicians trained in geriatric medicine who understand the unique needs of older adults.',
    tone: 'blue',
  },
  {
    key: 'meds',
    title: 'Medication Expertise',
    copy: 'Careful management of multiple medications to ensure safety and effectiveness.',
    tone: 'blue',
  },
  {
    key: 'holistic',
    title: 'Holistic Approach',
    copy: 'Addressing physical, mental, emotional, and social aspects of aging and health.',
    tone: 'blue',
  },
  {
    key: 'family',
    title: 'Family Involvement',
    copy: 'Working with families and caregivers to provide comprehensive support and care coordination.',
    tone: 'rose',
  },
];

const renderGeriatricIcon = (icon) => {
  const stroke = '#a5b4fc';
  switch (icon) {
    case 'steth':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4v5a5 5 0 0 0 10 0V4" />
          <path d="M8 15a6 6 0 0 0 12 0v-3" />
          <circle cx="18" cy="10" r="2" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
        </svg>
      );
    case 'pill':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="9" height="9" rx="2" />
          <rect x="12" y="12" width="9" height="9" rx="2" />
          <path d="M12 3v4c0 1.7-1.3 3-3 3H5" />
        </svg>
      );
    case 'brain':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 4c0-1.1-.9-2-2-2-1 0-1.85.75-1.98 1.72A2.5 2.5 0 0 0 6.5 6.5c-.17 0-.34.02-.5.05A3 3 0 0 0 4 9v1.5c0 .5.14.97.38 1.37A2.5 2.5 0 0 0 6.5 18H7" />
          <path d="M9 5.5c.9 0 1.7.4 2.26 1M9 9h1" />
          <path d="M12 12v7" />
          <path d="M18 18h-.5a2.5 2.5 0 0 1-2.12-3.75A2 2 0 0 1 15 13V9a3 3 0 0 0-3-3" />
          <path d="M12 6c0-1.1.9-2 2-2 .74 0 1.39.4 1.74 1" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
          <path d="m9.5 12.5 2 2 3-4" />
        </svg>
      );
    case 'handshake':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 11.5 7 9l4 3 4-3 3 2.5" />
          <path d="M3 7v6.5L7 16" />
          <path d="M21 7v6.5L17 16" />
          <path d="M10 16v2" />
          <path d="M14 16v2" />
        </svg>
      );
    default:
      return null;
  }
};

const renderGeriatricWhyIcon = (key, tone = 'blue') => {
  const stroke = tone === 'rose' ? '#fb7185' : '#93c5fd';
  switch (key) {
    case 'age':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" />
        </svg>
      );
    case 'meds':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="9" height="9" rx="2" />
          <rect x="12" y="12" width="9" height="9" rx="2" />
          <path d="M12 3v4c0 1.7-1.3 3-3 3H5" />
        </svg>
      );
    case 'holistic':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );
    case 'family':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <path d="M4 21v-3a4 4 0 0 1 4-4h.5" />
          <path d="M19 21v-3a4 4 0 0 0-4-4h-.5" />
          <path d="M12 14v7" />
        </svg>
      );
    default:
      return null;
  }
};

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
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-8 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Geriatric Care
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Services We Offer</h2>
            <p className="text-slate-200 text-lg leading-relaxed">
              Comprehensive geriatric care services for healthy aging
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {geriatricServices.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  {renderGeriatricIcon(service.icon)}
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
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-8 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Trusted geriatric care
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose Our Geriatric Care Services?
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
              Specialized, coordinated care to keep seniors healthier, safer, and supported.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {geriatricWhy.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  {renderGeriatricWhyIcon(card.key, card.tone)}
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  {card.title}
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  {card.copy}
                </p>
              </div>
            ))}
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
