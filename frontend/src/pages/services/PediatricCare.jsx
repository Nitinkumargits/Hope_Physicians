import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
// High-quality image from Unsplash - Pediatric Care (Child with doctor)
const pediatricsImg =
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&q=90&auto=format&fit=crop";

const pediatricServices = [
  {
    key: "well-child",
    title: "Well-Child Visits",
    desc: "Regular check-ups, growth monitoring, developmental assessments, and age-appropriate screenings.",
    icon: "clock",
  },
  {
    key: "vaccinations",
    title: "Vaccinations",
    desc: "Complete immunization schedules following CDC guidelines to protect your child from preventable diseases.",
    icon: "shield",
  },
  {
    key: "acute",
    title: "Acute Illness Care",
    desc: "Treatment for common childhood illnesses, infections, fevers, and respiratory conditions.",
    icon: "stethoscope",
  },
  {
    key: "developmental",
    title: "Developmental Screening",
    desc: "Early detection and intervention for developmental delays, learning disabilities, and behavioral concerns.",
    icon: "puzzle",
  },
  {
    key: "chronic",
    title: "Chronic Condition Management",
    desc: "Specialized care for asthma, allergies, diabetes, ADHD, and other chronic pediatric conditions.",
    icon: "heart",
  },
  {
    key: "education",
    title: "Parent Education",
    desc: "Guidance on nutrition, safety, sleep, behavior, and healthy development for your child.",
    icon: "book",
  },
];

const pediatricWhy = [
  {
    key: "friendly",
    title: "Child-Friendly Environment",
    copy: "Our clinic is designed to make children feel comfortable and safe during their visits.",
    tone: "blue",
  },
  {
    key: "specialists",
    title: "Pediatric Specialists",
    copy: "Board-certified pediatricians with expertise in child health and development.",
    tone: "blue",
  },
  {
    key: "growth",
    title: "Growth Monitoring",
    copy: "Regular tracking of your child's growth, development, and milestones to ensure healthy progress.",
    tone: "blue",
  },
  {
    key: "preventive",
    title: "Preventive Focus",
    copy: "Emphasis on preventive care, vaccinations, and early intervention to keep children healthy.",
    tone: "rose",
  },
];

const renderWhyIcon = (key, tone = "blue") => {
  const stroke = tone === "rose" ? "#fb7185" : "#93c5fd";
  switch (key) {
    case "friendly":
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
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
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
    case "growth":
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
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 4 4 5-7" />
          <path d="M16 8h3v3" />
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
          <path d="M10 12.5 12 14l3-3.5" />
        </svg>
      );
    default:
      return null;
  }
};

const renderServiceIcon = (icon) => {
  const stroke = "#a5b4fc";
  switch (icon) {
    case "clock":
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
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
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
    case "stethoscope":
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
          <path d="M5 4v5a5 5 0 0 0 10 0V4" />
          <path d="M8 15a6 6 0 0 0 12 0v-3" />
          <circle cx="18" cy="10" r="2" />
        </svg>
      );
    case "puzzle":
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
          <path d="M4 4h5v4a2 2 0 1 1-4 0H4Z" />
          <path d="M15 4h5v5h-4a2 2 0 1 1-1-4V4Z" />
          <path d="M4 15h4a2 2 0 1 1 4 0v4H4Z" />
          <path d="M14 15a2 2 0 1 1 4 0v4h-5v-4Z" />
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
    case "book":
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
          backgroundImage: `url(${pediatricsImg})`,
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
                  Pediatric Care
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 reveal-on-scroll leading-relaxed">
                  Compassionate, specialized healthcare for infants, children,
                  and adolescents. Our pediatric specialists are trained to
                  address the physical, emotional, and developmental needs of
                  young patients in a warm, child-friendly environment.
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
                Caring for Your Child's Health
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Our Pediatric Care department is dedicated to providing
                comprehensive, age-appropriate medical care for children from
                birth through adolescence.
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
              Specialized Care for Children
            </h2>
            <div className="max-w-3xl mx-auto text-left space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Our Pediatric Care department is dedicated to providing
                comprehensive, age-appropriate medical care for children from
                birth through adolescence. We understand that children have
                unique healthcare needs and require specialized attention.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our pediatric specialists are trained to address the physical,
                emotional, and developmental needs of young patients in a warm,
                child-friendly environment.
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
              Comprehensive pediatric services for your child's health and
              development
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
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Trusted pediatric care
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose Our Pediatric Care?
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
              Specialized care tailored to children with a focus on safety,
              comfort, and healthy development.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pediatricWhy.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  {renderWhyIcon(card.key, card.tone)}
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
                Schedule Your Child's Next Visit
              </h2>
              <p className="text-blue-50 text-lg">
                Book an appointment with our pediatric care team today.
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

export default PediatricCare;
