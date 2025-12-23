import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
// High-quality image from Unsplash - Men's Health (Male patient consultation)
const mensImg =
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=90&auto=format&fit=crop";

const menServices = [
  {
    key: "annual",
    title: "Annual Physical Exams",
    desc: "Comprehensive health screenings, blood work, and preventive care assessments.",
    icon: "heartbeat",
  },
  {
    key: "prostate",
    title: "Prostate Health",
    desc: "Prostate screenings, PSA testing, and management of prostate-related conditions.",
    icon: "shield",
  },
  {
    key: "cardio",
    title: "Cardiovascular Health",
    desc: "Heart health assessments, cholesterol management, and cardiovascular risk evaluation.",
    icon: "heart",
  },
  {
    key: "hormone",
    title: "Hormone Therapy",
    desc: "Testosterone level testing and hormone replacement therapy when appropriate.",
    icon: "atom",
  },
  {
    key: "sexual",
    title: "Sexual Health",
    desc: "Confidential evaluation and treatment of sexual health concerns and erectile dysfunction.",
    icon: "spark",
  },
  {
    key: "mental",
    title: "Mental Health Support",
    desc: "Counseling and support for stress, anxiety, depression, and mental wellness.",
    icon: "brain",
  },
];

const menWhy = [
  {
    key: "confidential",
    title: "Confidential Care",
    copy: "Private, confidential consultations in a comfortable, judgment-free environment.",
    tone: "blue",
  },
  {
    key: "preventive",
    title: "Preventive Focus",
    copy: "Early detection and prevention of common men's health issues through regular screenings.",
    tone: "blue",
  },
  {
    key: "comprehensive",
    title: "Comprehensive Approach",
    copy: "Addressing physical, mental, and emotional health needs specific to men.",
    tone: "blue",
  },
  {
    key: "expert",
    title: "Expert Care",
    copy: "Experienced physicians specializing in men's health and wellness.",
    tone: "rose",
  },
];

const renderMenWhyIcon = (key, tone = "blue") => {
  const stroke = tone === "rose" ? "#fb7185" : "#93c5fd";
  switch (key) {
    case "confidential":
      return (
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "preventive":
      return (
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
          <path d="m10 12.5 2 1.5 3-3.5" />
        </svg>
      );
    case "comprehensive":
      return (
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <path d="M4 21v-3a4 4 0 0 1 4-4h.5" />
          <path d="M19 21v-3a4 4 0 0 0-4-4h-.5" />
          <path d="M12 14v7" />
        </svg>
      );
    case "expert":
      return (
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path d="M12 2 2 7l10 5 10-5-10-5Z" />
          <path d="M2 12l10 5 10-5" />
          <path d="M2 17l10 5 10-5" />
        </svg>
      );
    default:
      return null;
  }
};

const renderMenIcon = (icon) => {
  const stroke = "#a5b4fc";
  switch (icon) {
    case "heartbeat":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path
            d="M3 10.5C3 6.9 5.9 4 9.5 4c1.9 0 3.6.9 4.7 2.3C15.3 4.9 17 4 18.9 4 22.5 4 25.4 6.9 25.4 10.5c0 5.7-9.4 10.5-9.4 10.5S3 16.2 3 10.5Z"
            transform="translate(-1 -1)"
          />
          <path d="M5 12h3l2-3 3 6 2-3h3" />
        </svg>
      );
    case "shield":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
          <path d="m9.5 12.5 2 2 3-4" />
        </svg>
      );
    case "heart":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
        </svg>
      );
    case "atom":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.36-7.36-1.42 1.42M8.06 17.94l-1.42 1.42m0-12.72 1.42 1.42m10.66 10.66-1.42-1.42" />
        </svg>
      );
    case "spark":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path d="m12 2-1.5 4.5L6 7l3.5 3L8 15l4-2.5L16 15l-1.5-5 3.5-3-4.5-.5L12 2Z" />
        </svg>
      );
    case "brain":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path d="M15 4c0-1.1-.9-2-2-2-1 0-1.85.75-1.98 1.72A2.5 2.5 0 0 0 6.5 6.5c-.17 0-.34.02-.5.05A3 3 0 0 0 4 9v1.5c0 .5.14.97.38 1.37A2.5 2.5 0 0 0 6.5 18H7" />
          <path d="M9 5.5c.9 0 1.7.4 2.26 1M9 9h1" />
          <path d="M12 12v7" />
          <path d="M18 18h-.5a2.5 2.5 0 0 1-2.12-3.75A2 2 0 0 1 15 13V9a3 3 0 0 0-3-3" />
          <path d="M12 6c0-1.1.9-2 2-2 .74 0 1.39.4 1.74 1" />
        </svg>
      );
    default:
      return null;
  }
};

const MensHealth = () => {
  useEffect(() => {
    // Reveal on scroll animation
    const reveals = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((r) => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden py-16 md:py-24 reveal-on-scroll"
        role="banner"
        style={{
          backgroundImage: `url(${mensImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "high-quality",
        }}>
        <div className="hero-overlay"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-start min-h-[500px]">
            {/* Left: Blue Overlay with Text */}
            <div className="space-y-6">
              <div className="bg-primary rounded-3xl p-10 shadow-2xl max-w-lg border border-white/10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 reveal-on-scroll tracking-tight">
                  Men's Health
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 reveal-on-scroll leading-relaxed">
                  Preventive and specialized healthcare services tailored for
                  men. Our comprehensive men's health services address the
                  unique healthcare needs of men at every stage of life.
                </p>
                <Link
                  to="/appointment"
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 reveal-on-scroll">
                  <span>Book an Appointment</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: Welcome Text */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "serif" }}>
                Your Health, Our Priority
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We provide confidential, comprehensive healthcare services
                designed specifically for men's unique health needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                Our Services
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Comprehensive Men's Healthcare
            </h2>
            <div className="max-w-3xl mx-auto text-left space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Our Men's Health department provides specialized medical care
                addressing the unique health needs of men at every stage of
                life. We focus on preventive care, early detection, and
                treatment of conditions that commonly affect men.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our experienced physicians understand men's health concerns and
                provide confidential, compassionate care in a comfortable
                environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OFFERED */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute inset-8 rounded-3xl border border-white/5 opacity-40"
            aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <p className="text-white/90 text-sm uppercase tracking-wider font-semibold">
                What We Offer
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Services We Offer
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Comprehensive men's health services for optimal wellness
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {menServices.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  {renderMenIcon(service.icon)}
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
          <span
            className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute inset-8 rounded-3xl border border-white/5 opacity-40"
            aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <p className="text-white/90 text-sm uppercase tracking-wider font-semibold">
                Why Choose Us
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Why Choose Our Men's Health Services?
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Confidential, comprehensive care tailored to men's health across
              every stage of life.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {menWhy.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  {renderMenWhyIcon(card.key, card.tone)}
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  {card.title}
                </h3>
                <p className="text-slate-200 text-center mt-2">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-enhanced relative overflow-hidden py-14 md:py-16 reveal-on-scroll bg-slate-50">
        <div className="pointer-events-none absolute inset-0"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cta-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="cta-copy space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Take Charge of Your Health Today
              </h2>
              <p className="text-slate-600 text-lg">
                Schedule your men's health screening or consultation with our
                team.
              </p>
            </div>
            <Link
              to="/appointment"
              className="cta-primary-btn inline-flex items-center justify-center px-5 py-3 rounded-full font-semibold transition duration-200">
              <span>Book Appointment</span>
              <span className="cta-arrow ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default MensHealth;
