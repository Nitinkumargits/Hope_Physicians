import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Home.css";
// High-quality image from Unsplash - Family Medicine (Doctor with family)
const familyImg =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1920&q=90&auto=format&fit=crop";

const serviceImages = {
  acute:
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  diabetes:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  hypertension:
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  kidney:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  cardiac:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  neuro:
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  stroke:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  neuropathy:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  "heart-failure":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  pulmonary:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  "sleep-apnea":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  copd: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  asthma:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  thyroid:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  depression:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  anxiety:
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  gastro:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  infectious:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  skin: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  orthopedic:
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  arthritis:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  "trigger-point":
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  cortisone:
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  weight:
    "https://images.unsplash.com/photo-1547015179-7c1d6b1f0c5b?w=900&auto=format&fit=crop",
  surgery:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  "mens-health":
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  "womens-health":
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  pediatric:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  preventative:
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&auto=format&fit=crop",
  "well-child":
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop",
  wellness:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
  immunizations:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop",
};

const FamilyMedicine = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleBook = (serviceLabel) => {
    navigate(`/appointment?service=${encodeURIComponent(serviceLabel)}`);
  };

  const handleLearnMore = (serviceLabel) => {
    navigate(`/contact?topic=${encodeURIComponent(serviceLabel)}`);
  };

  const services = [
    {
      key: "acute",
      icon: "fa-stethoscope",
      label: "Acute and Chronic Care Management",
    },
    {
      key: "diabetes",
      icon: "fa-syringe",
      label: "Diabetes Management",
    },
    { key: "hypertension", icon: "fa-heart", label: "Hypertension" },
    {
      key: "kidney",
      icon: "fa-kidneys",
      label: "Chronic Kidney Disease",
    },
    {
      key: "cardiac",
      icon: "fa-heartbeat",
      label: "Coronary Artery Disease",
    },
    {
      key: "neuro",
      icon: "fa-brain",
      label: "Neurological Diseases",
    },
    { key: "stroke", icon: "fa-notes-medical", label: "Stroke" },
    {
      key: "neuropathy",
      icon: "fa-network-wired",
      label: "Neuropathy",
    },
    {
      key: "heart-failure",
      icon: "fa-heart-broken",
      label: "Congestive Heart Failure",
    },
    {
      key: "pulmonary",
      icon: "fa-lungs",
      label: "Pulmonary Diseases",
    },
    {
      key: "sleep-apnea",
      icon: "fa-bed",
      label: "Obstructive Sleep Apnea",
    },
    { key: "copd", icon: "fa-wind", label: "COPD" },
    { key: "asthma", icon: "fa-lungs", label: "Asthma" },
    {
      key: "thyroid",
      icon: "fa-wave-square",
      label: "Thyroid Disorders",
    },
    { key: "depression", icon: "fa-cloud-rain", label: "Depression" },
    { key: "anxiety", icon: "fa-head-side-virus", label: "Anxiety" },
    {
      key: "gastro",
      icon: "fa-stomach",
      label: "Gastrointestinal Diseases",
    },
    {
      key: "infectious",
      icon: "fa-virus",
      label: "Infectious Diseases",
    },
    { key: "skin", icon: "fa-allergies", label: "Skin Diseases" },
    {
      key: "orthopedic",
      icon: "fa-bone",
      label: "Orthopedic Diseases",
    },
    { key: "arthritis", icon: "fa-hand", label: "Arthritis" },
    {
      key: "trigger-point",
      icon: "fa-syringe",
      label: "Trigger Point Injections",
    },
    {
      key: "cortisone",
      icon: "fa-joint",
      label: "Cortisone Joint Injections",
    },
    {
      key: "weight",
      icon: "fa-weight-scale",
      label: "Medical Weight Management",
    },
    {
      key: "surgery",
      icon: "fa-kit-medical",
      label: "Minor Surgical Procedures",
    },
    { key: "mens-health", icon: "fa-mars", label: "Men's Health" },
    { key: "womens-health", icon: "fa-venus", label: "Women's Health" },
    { key: "pediatric", icon: "fa-baby", label: "Pediatric Health" },
    {
      key: "preventative",
      icon: "fa-shield-heart",
      label: "Preventative Healthcare",
    },
    {
      key: "well-child",
      icon: "fa-child",
      label: "Well-Child Checkups",
    },
    {
      key: "wellness",
      icon: "fa-clipboard-check",
      label: "Annual Wellness Exams",
    },
    {
      key: "immunizations",
      icon: "fa-shield-virus",
      label: "Immunizations",
    },
  ];

  const filteredServices = services.filter((s) =>
    s.label.toLowerCase().includes(search.trim().toLowerCase())
  );
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${familyImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Family Medicine</h1>
          <p className="subheading">
            Comprehensive primary healthcare for individuals and families of all
            ages
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div
            className="about-wrapper"
            style={{ gridTemplateColumns: "1fr", display: "block" }}>
            <div
              className="about-content"
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                textAlign: "center",
                padding: "40px 20px",
              }}>
              <h2
                className="section-title"
                style={{
                  fontSize: "36px",
                  color: "#004aad",
                  marginBottom: "24px",
                  fontWeight: "700",
                  lineHeight: "1.2",
                }}>
                Comprehensive Family Healthcare
              </h2>
              <div
                style={{
                  textAlign: "left",
                  maxWidth: "800px",
                  margin: "0 auto",
                }}>
                <p
                  className="about-intro"
                  style={{
                    color: "#2d3748",
                    marginBottom: "20px",
                    fontSize: "18px",
                    lineHeight: "1.8",
                    fontWeight: "400",
                  }}>
                  At Hope Physicians, our Family Medicine department provides
                  comprehensive, patient-centered primary care for individuals
                  and families across all stages of life. We focus on preventive
                  care, health maintenance, and the treatment of acute and
                  chronic conditions.
                </p>
                <p
                  className="about-intro"
                  style={{
                    color: "#2d3748",
                    marginBottom: "0",
                    fontSize: "18px",
                    lineHeight: "1.8",
                    fontWeight: "400",
                  }}>
                  Our experienced family physicians serve as your primary
                  healthcare partners, coordinating care and building long-term
                  relationships with you and your family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OFFERED */}
      <section
        className="py-5 bg-light section relative overflow-hidden"
        style={{ background: "#f6f8fb", padding: "64px 0" }}>
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute -top-24 left-1/5 h-72 w-72 rounded-full"
            style={{
              background: "rgba(59,130,246,0.15)",
              filter: "blur(80px)",
            }}
            aria-hidden="true"></span>
          <span
            className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full"
            style={{
              background: "rgba(99,102,241,0.12)",
              filter: "blur(80px)",
            }}
            aria-hidden="true"></span>
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-5">
            <h2 className="section-title center">Our Services</h2>
            <p className="section-subtitle center">
              Comprehensive medical care tailored to your family's needs
            </p>
          </div>
          <div className="d-flex justify-content-center mb-5">
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                position: "relative",
              }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "4px",
                  boxShadow: searchFocused
                    ? "0 6px 24px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.9)"
                    : "0 4px 20px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                  border: searchFocused
                    ? "1px solid rgba(37,99,235,0.3)"
                    : "1px solid rgba(226,232,240,0.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s ease",
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    paddingLeft: "16px",
                    flexShrink: 0,
                  }}>
                  <i
                    className="fas fa-search"
                    style={{
                      color: "#0f172a",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}
                    aria-hidden="true"></i>
                  <span
                    style={{
                      color: "#475569",
                      fontSize: "15px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}>
                    Search services
                  </span>
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search services..."
                  aria-label="Search services"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    padding: "14px 16px 14px 0",
                    fontSize: "15px",
                    color: "#0f172a",
                    fontWeight: 400,
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="row g-4"
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              paddingRight: "6px",
            }}>
            {(filteredServices.length ? filteredServices : services).map(
              (item) => (
                <div key={item.key} className="col-sm-6 col-lg-4">
                  <article
                    tabIndex={0}
                    aria-label={item.label}
                    className="service-card h-100 rounded-4 overflow-hidden d-flex flex-column position-relative bg-white text-start"
                    style={{
                      boxShadow:
                        hovered === item.key
                          ? "0 18px 42px rgba(15,23,42,0.16)"
                          : "0 8px 26px rgba(15,23,42,0.12)",
                      transition: "all 0.3s ease",
                      transform:
                        hovered === item.key
                          ? "translateY(-6px) scale(1.01)"
                          : "translateY(0) scale(1)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHovered(item.key)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(item.key)}
                    onBlur={() => setHovered(null)}>
                    <div
                      className="position-relative overflow-hidden"
                      style={{
                        height: 190,
                        background: `linear-gradient(180deg, rgba(15,23,42,0.65), rgba(15,23,42,0.9)), url('${
                          serviceImages[item.key] ||
                          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop"
                        }') center/cover`,
                      }}>
                      <div
                        className="position-absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(15,23,42,0.35), rgba(15,23,42,0.85))",
                        }}></div>
                    </div>
                    <div
                      className="d-flex flex-column gap-2"
                      style={{ padding: "1.25rem" }}>
                      <h5
                        className="fw-bold mb-1"
                        style={{ color: "#0f172a", lineHeight: 1.35 }}>
                        {item.label}
                      </h5>
                      <p
                        className="mb-0"
                        style={{
                          color: "#475569",
                          lineHeight: 1.6,
                          fontSize: "0.96rem",
                        }}>
                        Tailored care and coordination from our family medicine
                        team with proactive guidance, timely follow-ups, and
                        compassionate support.
                      </p>
                      <div className="mt-3 d-flex align-items-center justify-content-between">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary px-3 fw-semibold"
                          onClick={() => handleBook(item.label)}>
                          Book
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: 44,
                            height: 44,
                            boxShadow: "0 10px 26px rgba(37,99,235,0.28)",
                            transition:
                              "transform 0.25s ease, box-shadow 0.25s ease",
                          }}
                          aria-label={`Learn more about ${item.label}`}
                          onClick={() => handleLearnMore(item.label)}>
                          <i
                            className="fas fa-arrow-right"
                            aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section" style={{ background: "#f6f8fb" }}>
        <div className="container">
          <h2 className="section-title center">
            Why Choose Our Family Medicine Services?
          </h2>
          <div
            className="about-features"
            style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="feature-box" style={{ alignItems: "center" }}>
              <div
                className="feature-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#004aad"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M5 21v-3a4 4 0 0 1 4-4h.5" />
                  <path d="M13.5 14H14a4 4 0 0 1 4 4v3" />
                  <path d="M12 14v7" />
                  <circle cx="9" cy="7" r="3" />
                  <circle cx="15" cy="7" r="3" />
                </svg>
              </div>
              <div>
                <h3>Whole Family Care</h3>
                <p>
                  One physician for your entire family, building lasting
                  relationships and understanding your family's health history.
                </p>
              </div>
            </div>
            <div className="feature-box" style={{ alignItems: "center" }}>
              <div
                className="feature-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#004aad"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M12 1v5" />
                  <path d="M17 5H7a2 2 0 0 0-2 2v11" />
                  <path d="M7 15h10" />
                  <path d="M9 19h6" />
                </svg>
              </div>
              <div>
                <h3>Comprehensive Approach</h3>
                <p>
                  We address physical, mental, and emotional health needs for
                  patients of all ages.
                </p>
              </div>
            </div>
            <div className="feature-box" style={{ alignItems: "center" }}>
              <div
                className="feature-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#004aad"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
              </div>
              <div>
                <h3>Convenient Access</h3>
                <p>
                  Easy scheduling, same-day appointments for urgent needs, and
                  extended hours for your convenience.
                </p>
              </div>
            </div>
            <div className="feature-box" style={{ alignItems: "center" }}>
              <div
                className="feature-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#004aad"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="M2 12l10 5 10-5" />
                  <path d="M2 17l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3>Preventive Focus</h3>
                <p>
                  Emphasis on preventive care and early detection to maintain
                  optimal health and prevent complications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: "10px", fontSize: "24px" }}>
              Ready to Schedule Your Family's Healthcare?
            </h2>
            <p style={{ margin: 0, opacity: 0.95 }}>
              Book an appointment with our family medicine team today.
            </p>
          </div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <a
              href="/appointment"
              className="cta-btn"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 24px",
                minWidth: "160px",
              }}>
              <span style={{ fontWeight: "700", fontSize: "16px" }}>Book</span>
              <span style={{ fontWeight: "700", fontSize: "16px" }}>
                Appointment
              </span>
            </a>
            <Link
              to="/contact"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 22px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                color: "rgba(255, 255, 255, 0.9)",
                textDecoration: "none",
                fontWeight: "600",
                minWidth: "140px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.target.style.color = "rgba(255, 255, 255, 0.9)";
              }}>
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                Contact
              </span>
              <span style={{ fontWeight: "600", fontSize: "16px" }}>Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FamilyMedicine;
