import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import '../styles/Home.css';

import heroImg from "../assets/images/hero2.jpg";
import aboutImg from "../assets/images/about.jpg";
import familyImg from "../assets/images/family.jpeg";
import pediatricsImg from "../assets/images/pediatrics.jpg";
import mensImg from "../assets/images/mens.jpeg";
import womensImg from "../assets/images/women.jpeg";
import occupationalImg from "../assets/images/occupational.jpeg";
import geriatricImg from "../assets/images/geriatric.jpeg";
import doctorImg from "../assets/images/doctor.jpg";
import appointmentIcon from "../assets/images/appointment-icon.webp";
import medSupportImg from "../assets/images/med_support.jpg";
import adminSupportImg from "../assets/images/admin_support.jpg";

const Home = () => {

  useEffect(() => {
    document.title = "Hope Physicians — World-Class Healthcare";

    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(r => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  // Services (drives the dynamic Services section)
  const services = [
    {
      img: familyImg,
      title: "Family Medicine",
      desc: "Comprehensive primary healthcare for individuals & families.",
      path: "/family-medicine",
    },
    {
      img: pediatricsImg,
      title: "Pediatric Care",
      desc: "Compassionate care for infants, children and adolescents.",
      path: "/pediatric-care",
    },
    {
      img: mensImg,
      title: "Men's Health",
      desc: "Preventive & specialized care for men.",
      path: "/mens-health",
    },
    {
      img: womensImg,
      title: "Women's Health",
      desc: "Gynecological and maternal health services.",
      path: "/womens-health",
    },
    {
      img: occupationalImg,
      title: "Occupational Health",
      desc: "Workplace health programmes & screenings.",
      path: "/occupational-health",
    },
    {
      img: geriatricImg,
      title: "Geriatric Care",
      desc: "Holistic senior care & chronic disease management.",
      path: "/geriatric-care",
    },
  ];

  const testimonials = [
    { 
      name: "Sarah Johnson", 
      feedback: "Outstanding care from the cardiology department. Dr. Smith and his team were incredibly professional and caring throughout my treatment.",
      rating: 5
    },
    { 
      name: "Michael Brown", 
      feedback: "The staff at Hope Physicians is exceptional. They made me feel comfortable and cared for during my entire visit.",
      rating: 5
    },
    { 
      name: "Emily Davis", 
      feedback: "I've been coming here for years and the quality of care never disappoints. Highly recommend to anyone looking for excellent healthcare.",
      rating: 5
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero-section"
        role="banner"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay"></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', minHeight: '500px' }}>
            <div className="hero-content">
              <h1 className="reveal-on-scroll" style={{ fontSize: '48px', marginBottom: '20px' }}>
                World-Class Healthcare at Hope Physicians
              </h1>
              <p className="subheading reveal-on-scroll" style={{ fontSize: '20px', marginBottom: '30px' }}>
                Providing compassionate & expert medical care for you and your family.
              </p>

              <div className="hero-ctas reveal-on-scroll">
                <Link className="hero-btn" to="/appointment">Book Appointment</Link>
                <a className="hero-ghost" href="/contact">Contact Us</a>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '300px',
                height: '300px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}>
                <img 
                  src={doctorImg} 
                  alt="Hope Physicians" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION TIMING BANNER */}
      <section className="consultation-banner section" style={{
        background: 'linear-gradient(135deg, #004aad 0%, #003784 100%)',
        color: '#fff',
        padding: '40px 0',
        marginTop: '-50px',
        position: 'relative',
        zIndex: 3,
        borderRadius: '0 0 30px 30px'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🕐
              </div>
              <div>
                <h5 style={{ margin: 0, marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Consultation Hours
                </h5>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  Mon - Thu: 8:00 AM - 5:00 PM<br />
                  Fri: 8:00 AM - 12:00 PM
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📞
              </div>
              <div>
                <h5 style={{ margin: 0, marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Emergency Contact
                </h5>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  24/7 Emergency: 911<br />
                  Ambulance: 911
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📅
              </div>
              <div>
                <h5 style={{ margin: 0, marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Book Appointment
                </h5>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  Call: 252-522-3663<br />
                  Fax: 252-522-3660
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section section reveal-on-scroll">
        <div className="container about-wrapper">
          <div className="about-img" style={{ position: 'relative' }}>
            <img src={aboutImg} alt="Hope Physicians facility" loading="lazy" />
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: '#004aad',
              color: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>25+</div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase' }}>Years of Excellence</div>
            </div>
          </div>

          <div className="about-content">
            <h2 className="section-title">About Hope Physicians</h2>
            <p className="about-intro" style={{ fontSize: '18px', marginBottom: '30px' }}>
              Leading the way in medical excellence with cutting-edge technology and compassionate care since 1995.
            </p>

            <div className="about-features">
              <div className="feature-box">
                <div className="feature-icon">🏥</div>
                <div>
                  <h3>State-of-the-Art Facilities</h3>
                  <p>Equipped with the latest medical technology</p>
                </div>
              </div>

              <div className="feature-box">
                <div className="feature-icon">👨‍⚕️</div>
                <div>
                  <h3>Expert Medical Team</h3>
                  <p>Board-certified physicians and specialists</p>
                </div>
              </div>

              <div className="feature-box">
                <div className="feature-icon">❤️</div>
                <div>
                  <h3>Patient-Centered Care</h3>
                  <p>Personalized treatment plans for every patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section reveal-on-scroll" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <h2 className="section-title center">Why Choose Hope Physicians?</h2>
          <p className="section-subtitle center">
            Leading the way in medical excellence with cutting-edge technology and compassionate care
          </p>

          <div className="services-grid" style={{ marginTop: '40px' }}>
            <div className="service-card">
              <div className="service-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🕐</div>
                <h3>24/7 Emergency Care</h3>
                <p>Round-the-clock emergency services with immediate response</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>👨‍⚕️</div>
                <h3>Expert Doctors</h3>
                <p>Team of experienced specialists and healthcare professionals</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔬</div>
                <h3>Advanced Technology</h3>
                <p>State-of-the-art medical equipment and facilities</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>❤️</div>
                <h3>Patient-Centric</h3>
                <p>Focused on providing the best patient care experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-section section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title center">Our Services</h2>
          <p className="section-subtitle center">Comprehensive healthcare services for you and your family</p>

          <div className="services-grid">
            {services.map((s, i) => (
              <article key={s.path} className="service-card" aria-labelledby={`svc-${i}`}>
                <div className="service-img">
                  <img src={s.img} alt={s.title} loading="lazy" />
                </div>
                <div className="service-body">
                  <h3 id={`svc-${i}`}>{s.title}</h3>
                  <p>{s.desc}</p>
                  <Link className="service-link" to={s.path}>
                    Learn more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section section reveal-on-scroll" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <h2 className="section-title center">What Our Patients Say</h2>
          <p className="section-subtitle center">Real experiences from our valued patients</p>

          <div className="testimonials-grid" style={{ marginTop: '40px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="service-card">
                <div className="service-body">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: '#e0e0e0',
                      marginRight: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      👤
                    </div>
                    <div>
                      <h5 style={{ margin: 0, marginBottom: '5px' }}>{t.name}</h5>
                      <div style={{ color: '#ffc107' }}>
                        {Array(t.rating).fill(0).map((_, idx) => (
                          <span key={idx}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "{t.feedback}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIST */}
      <section className="specialist-section section">
        <div className="container">
          <h2 className="section-title center">Meet Our Specialist</h2>
          <p className="section-subtitle center">Expert healthcare professional leading our medical team</p>

          <div className="specialist-container" style={{ marginTop: '40px' }}>
            <div className="specialist-photo">
              <img src={doctorImg} alt="Dr. Okonkwo" />
            </div>

            <div className="specialist-info">
              <h3 className="doctor-name">Dr. Okonkwo</h3>
              <p className="doctor-role" style={{ color: '#004aad', fontWeight: '700' }}>
                Lead Physician - Family Medicine
              </p>
              <p className="doctor-qual">MBBS, MD - Family Medicine | 15+ Years Experience</p>

              <p className="doctor-bio" style={{ fontSize: '18px', marginTop: '20px', marginBottom: '20px' }}>
                Dr. Okonkwo is a highly experienced family physician with a passion for providing comprehensive healthcare to patients of all ages. His expertise includes:
              </p>

              <ul className="doctor-skills">
                <li>✔ Comprehensive Family Healthcare</li>
                <li>✔ Preventive Medicine & Wellness</li>
                <li>✔ Chronic Disease Management</li>
                <li>✔ Patient Education & Counseling</li>
              </ul>

              <div className="specialist-buttons" style={{ marginTop: '30px' }}>
                <Link to="/appointment" className="doctor-btn">Book Appointment</Link>
                <a href="mailto:doctor@hopephysicians.com" className="icon-btn email" style={{ marginLeft: '10px' }}>📧 Email</a>
                <a href="#" className="icon-btn linkedin" style={{ marginLeft: '10px' }}>🔗 LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT STAFF SECTION */}
      <section className="section reveal-on-scroll" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <h2 className="section-title center">Our Support Team</h2>
          <p className="section-subtitle center">Dedicated professionals ensuring quality patient care</p>

          <div className="services-grid" style={{ marginTop: '40px' }}>
            <div className="service-card">
              <div className="service-img">
                <img src={medSupportImg} alt="Medical Support Team" loading="lazy" />
              </div>
              <div className="service-body" style={{ textAlign: 'center' }}>
                <h3>Medical Support Team</h3>
                <p style={{ color: '#004aad' }}>
                  Our dedicated team of healthcare professionals working together to provide exceptional patient care
                </p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-img">
                <img src={adminSupportImg} alt="Administrative Support Team" loading="lazy" />
              </div>
              <div className="service-body" style={{ textAlign: 'center' }}>
                <h3>Administrative Support Team</h3>
                <p style={{ color: '#004aad' }}>
                  Our administrative staff ensuring smooth operations and excellent patient experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section reveal-on-scroll">
        <div className="container cta-container">
          <h2>Ready to Book Your Appointment?</h2>
          <p>We make booking simple — choose a time and see a specialist you trust.</p>
          <Link to="/appointment" className="cta-btn">Book Appointment</Link>
        </div>
      </section>

      {/* DISCLAIMER SECTION */}
      <section className="section" style={{ background: '#f6f8fb', padding: '40px 0' }}>
        <div className="container">
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h4 style={{ color: '#004aad', marginBottom: '20px' }}>Disclaimer</h4>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginBottom: '15px' }}>
              The information provided on this website is for general informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website. In case of a medical emergency, call 911 immediately.
            </p>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginBottom: '15px' }}>
              Every person may respond differently to treatments, and results can vary from one patient to another. The information provided on this website should not be considered as a guarantee of specific results or outcomes.
            </p>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginBottom: 0 }}>
              By using this site and sharing your information, you agree to let us contact you through email, phone, or other ways. We also keep track of visits and use data to help improve our services and marketing. Your privacy is important to us, and we handle your information in accordance with our privacy policy.
            </p>
          </div>
        </div>
      </section>

      {/* FLOATING BUTTON */}
      <Link to="/appointment" className="floating-btn bounce-btn">
        <img src={appointmentIcon} alt="" />
        <span>Book Appointment</span>
      </Link>
    </>
  );
};

export default Home;
