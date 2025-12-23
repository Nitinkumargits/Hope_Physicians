import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
// High-quality image from Unsplash - Women's Health (Female patient with doctor)
const womensImg =
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=90&auto=format&fit=crop";

const womenServices = [
  {
    key: "annual",
    title: "Annual Well-Woman Exams",
    desc: "Comprehensive gynecological exams, Pap smears, breast exams, and preventive screenings.",
    icon: "flower",
  },
  {
    key: "repro",
    title: "Reproductive Health",
    desc: "Contraception counseling, family planning, fertility evaluations, and preconception care.",
    icon: "heart",
  },
  {
    key: "prenatal",
    title: "Prenatal & Postnatal Care",
    desc: "Comprehensive maternity care, prenatal visits, and postpartum support for new mothers.",
    icon: "baby",
  },
  {
    key: "menopause",
    title: "Menopause Management",
    desc: "Support and treatment for menopausal symptoms, hormone therapy, and bone health.",
    icon: "spark",
  },
  {
    key: "gyn",
    title: "Gynecological Conditions",
    desc: "Treatment for PCOS, endometriosis, fibroids, and other gynecological conditions.",
    icon: "shield",
  },
  {
    key: "breast",
    title: "Breast Health",
    desc: "Breast exams, mammography referrals, and breast health education and support.",
    icon: "ribbon",
  },
];

const womenWhy = [
  {
    key: "compassion",
    title: "Compassionate Care",
    copy: "Understanding, supportive care in a comfortable, women-centered environment.",
    tone: "rose",
  },
  {
    key: "specialists",
    title: "Women's Health Specialists",
    copy: "Experienced gynecologists and women's health providers dedicated to your wellness.",
    tone: "blue",
  },
  {
    key: "confidential",
    title: "Confidential & Private",
    copy: "Respectful, confidential consultations addressing all your health concerns.",
    tone: "blue",
  },
  {
    key: "holistic",
    title: "Holistic Approach",
    copy: "Comprehensive care addressing physical, emotional, and reproductive health needs.",
    tone: "blue",
  },
];

const renderWomenIcon = (icon) => {
  const stroke = "#a5b4fc";
  switch (icon) {
    case "flower":
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
          <path d="M12 22v-4" />
          <circle cx="12" cy="10" r="3" />
          <path d="M6.5 20a6.5 6.5 0 0 1 11 0" />
          <path d="M5 11c-1.5-2.5 1-5 3.5-3.5S12 4 12 4s2 1.5 3.5-.5S20.5 6.5 19 9c-1.2 2-4 3-7 3s-5.8-1-7-3Z" />
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
    case "baby":
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
          <circle cx="12" cy="6" r="3" />
          <path d="M7 22v-4a5 5 0 0 1 10 0v4" />
          <path d="M5 11a7 7 0 0 1 14 0" />
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
    case "ribbon":
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
          <path d="M12 2C8.7 2 6 4.7 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6Z" />
          <path d="M9.5 7.5 12 10l2.5-2.5" />
        </svg>
      );
    default:
      return null;
  }
};

const renderWomenWhyIcon = (key, tone = "blue") => {
  const stroke = tone === "rose" ? "#fb7185" : "#93c5fd";
  switch (key) {
    case "compassion":
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
          <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
        </svg>
      );
    case "specialists":
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
          <circle cx="12" cy="7" r="3" />
          <path d="M5.5 21v-1a6.5 6.5 0 0 1 13 0v1" />
          <path d="M10 11c-1.5.5-2.5 1.5-3 3" />
          <path d="M14 11c1.5.5 2.5 1.5 3 3" />
        </svg>
      );
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
    case "holistic":
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
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );
    default:
      return null;
  }
};

const WomensHealth = () => {
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
          backgroundImage: `url(${womensImg})`,
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
                  Women's Health
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 reveal-on-scroll leading-relaxed">
                  Comprehensive gynecological and maternal health services for
                  women. Our experienced physicians provide compassionate,
                  specialized care for all stages of a woman's life.
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
                Caring for Women's Health
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We provide comprehensive women's health services in a
                comfortable, supportive environment designed specifically for
                women.
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
              Comprehensive Women's Healthcare
            </h2>
            <div className="max-w-3xl mx-auto text-left space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Our Women's Health department provides specialized medical care
                addressing the unique health needs of women throughout all
                stages of life. We offer comprehensive gynecological services,
                reproductive health care, and maternal health support.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our compassionate team of women's health specialists provides
                personalized, confidential care in a supportive and comfortable
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
              Comprehensive women's health services for every stage of life
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {womenServices.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  {renderWomenIcon(service.icon)}
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
              Why Choose Our Women's Health Services?
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Compassionate, confidential care tailored to women at every stage
              of life.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {womenWhy.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  {renderWomenWhyIcon(card.key, card.tone)}
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
      <section className="relative py-14 md:py-16 reveal-on-scroll bg-gradient-to-r from-primary via-blue-700 to-indigo-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Schedule Your Women's Health Visit
              </h2>
              <p className="text-blue-50 text-lg">
                Book an appointment with our women's health team today.
              </p>
            </div>
            <Link
              to="/appointment"
              className="cta-primary-btn inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition duration-200">
              <span>Book Appointment</span>
              <span className="cta-arrow ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default WomensHealth;
