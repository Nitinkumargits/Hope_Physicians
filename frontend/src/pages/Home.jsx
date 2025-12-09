import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

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

  const consultationItems = [
    {
      key: "hours",
      title: "Consultation Hours",
      lines: ["Mon - Thu: 8:00 AM - 5:00 PM", "Fri: 8:00 AM - 12:00 PM"],
      icon: "clock",
    },
    {
      key: "emergency",
      title: "Emergency Contact",
      lines: ["24/7 Emergency: 911", "Ambulance: 911"],
      icon: "phone",
    },
    {
      key: "appointment",
      title: "Book Appointment",
      lines: ["Call: 252-522-3663", "Fax: 252-522-3660"],
      icon: "calendar",
    },
  ];

  const renderConsultationIcon = (icon) => {
    const stroke = "#bfdbfe";
    switch (icon) {
      case "clock":
        return (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <polyline points="12 7 12 12 15 14"></polyline>
          </svg>
        );
      case "phone":
        return (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 9.8 19.8 19.8 0 0 1 .08 1.18 2 2 0 0 1 2.05-.99h3a2 2 0 0 1 2 1.72c.12.92.37 1.82.73 2.67a2 2 0 0 1-.45 2.11L6.1 6.89a16 16 0 0 0 7 7l1.37-1.22a2 2 0 0 1 2.11-.45c.85.36 1.75.61 2.67.73A2 2 0 0 1 22 16.92Z" />
          </svg>
        );
      case "calendar":
        return (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

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
      feedback:
        "Outstanding care from the cardiology department. Dr. Smith and his team were incredibly professional and caring throughout my treatment.",
      rating: 5,
      avatar: familyImg,
    },
    {
      name: "Michael Brown",
      feedback:
        "The staff at Hope Physicians is exceptional. They made me feel comfortable and cared for during my entire visit.",
      rating: 5,
      avatar: mensImg,
    },
    {
      name: "Emily Davis",
      feedback:
        "I've been coming here for years and the quality of care never disappoints. Highly recommend to anyone looking for excellent healthcare.",
      rating: 5,
      avatar: womensImg,
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll"
        role="banner"
        style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay"></div>
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center min-h-[480px]">
            <div className="space-y-4 hero-content">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight reveal-on-scroll">
                World-Class Healthcare at Hope Physicians
              </h1>
              <p className="text-white/90 text-lg md:text-xl reveal-on-scroll">
                Providing compassionate & expert medical care for you and your family.
              </p>

              <div className="hero-ctas reveal-on-scroll">
                <Link className="hero-btn" to="/appointment">
                  Book Appointment
                </Link>
                <a className="hero-ghost" href="/contact">
                  Contact Us
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-[280px] h-[320px] md:w-[320px] md:h-[360px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/55 opacity-80" aria-hidden="true"></div>
                <img
                  src={doctorImg}
                  alt="Hope Physicians"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION TIMING BANNER */}
      <section className="relative overflow-hidden py-12 md:py-14 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white -mt-12 rounded-b-[28px]">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-16 top-6 h-60 w-60 rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-4 rounded-3xl border border-white/10 opacity-40" aria-hidden="true"></span>
          <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true"></span>
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center gap-3 text-center mb-8">
            <p className="text-white/80 text-sm md:text-base tracking-wide uppercase">Here when you need us</p>
            <div className="h-1.5 w-16 rounded-full bg-white/60 blur-[1px] shadow-[0_0_20px_rgba(255,255,255,0.35)]"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {consultationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur px-4 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.32)] hover:border-white/20">
                <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-white/10 border border-white/15 shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
                  <span className="absolute inset-0 rounded-full bg-white/10 blur-lg"></span>
                  {renderConsultationIcon(item.icon)}
                </div>
                <div>
                  <h5 className="m-0 mb-1 text-sm font-semibold tracking-wide uppercase text-white">
                    {item.title}
                  </h5>
                  <p className="m-0 text-sm text-white/90 leading-6">
                    {item.lines.map((line, idx) => (
                      <span key={idx} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-900 font-semibold text-sm px-5 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(0,0,0,0.22)] transition">
              <i className="fas fa-calendar-check text-blue-700"></i>
              Book an appointment
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -top-24 left-1/5 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" aria-hidden="true"></span>
          <span className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-indigo-400/12 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-6 rounded-3xl border border-slate-200/50" aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/40 opacity-80" aria-hidden="true"></div>
              <img src={aboutImg} alt="Hope Physicians facility" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute bottom-5 right-5 bg-blue-700 text-white px-5 py-4 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-xs uppercase tracking-wide">Years of Excellence</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">About Hope Physicians</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Leading the way in medical excellence with cutting-edge technology and compassionate care since 1995.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-white/80 backdrop-blur border border-slate-200 p-4 shadow-sm">
                  <div className="text-2xl">🏥</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">State-of-the-Art Facilities</h3>
                    <p className="text-slate-600">Equipped with the latest medical technology</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white/80 backdrop-blur border border-slate-200 p-4 shadow-sm">
                  <div className="text-2xl">👨‍⚕️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Expert Medical Team</h3>
                    <p className="text-slate-600">Board-certified physicians and specialists</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white/80 backdrop-blur border border-slate-200 p-4 shadow-sm">
                  <div className="text-2xl">❤️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Patient-Centered Care</h3>
                    <p className="text-slate-600">Personalized treatment plans for every patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
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
          <div className="grid gap-10 lg:grid-cols-[1fr,1.25fr] items-start">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Trusted by families
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Why Choose Hope Physicians?
              </h2>
              <p className="text-slate-200 text-lg leading-relaxed">
                Leading the way in medical excellence with cutting-edge
                technology and compassionate care.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                  <div className="text-xs uppercase text-slate-300">
                    Response
                  </div>
                  <div className="text-lg font-semibold text-blue-100">
                    24/7
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                  <div className="text-xs uppercase text-slate-300">
                    Specialists
                  </div>
                  <div className="text-lg font-semibold text-blue-100">
                    Expert-led
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                  <div className="text-xs uppercase text-slate-300">
                    Experience
                  </div>
                  <div className="text-lg font-semibold text-blue-100">
                    Patient-first
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 14" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  24/7 Emergency Care
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  Round-the-clock emergency services with immediate response
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20c0-3.333 2.667-5 6-5s6 1.667 6 5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  Expert Doctors
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  Team of experienced specialists and healthcare professionals
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M10 3h4" />
                    <path d="M12 3v9" />
                    <path d="M8 12h8" />
                    <path d="M7 19h10" />
                    <path d="M9 12v7" />
                    <path d="M15 12v7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  Advanced Technology
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  State-of-the-art medical equipment and facilities
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  Patient-Centric
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  Focused on providing the best patient care experience
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 flex justify-center">
              <Link
                to="/appointment"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-900 font-semibold text-sm px-5 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(0,0,0,0.22)] transition">
                <i className="fas fa-calendar-check text-blue-700"></i>
                Book an appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute -top-24 left-1/5 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute -bottom-28 right-1/6 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute inset-6 rounded-3xl border border-white/5 opacity-40"
            aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Care that covers all
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Our Services</h2>
              <p className="text-slate-200 text-lg leading-relaxed">
                Comprehensive healthcare services for you and your family.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <article
                key={s.path}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur shadow-xl transition duration-200 hover:-translate-y-2 hover:shadow-2xl"
                aria-labelledby={`svc-${i}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/60 opacity-90 mix-blend-normal"
                  />
                  <img
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105 saturate-[1.1] contrast-[1.05] brightness-[1.02]"
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <h3 id={`svc-${i}`} className="text-xl font-semibold text-white">
                      {s.title}
                    </h3>
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-[0_0_0_8px_rgba(59,130,246,0.12)]" aria-hidden="true"></span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{s.desc}</p>
                  <Link
                    className="mt-auto inline-flex items-center gap-2 text-blue-100 font-semibold tracking-wide transition duration-200 group-hover:text-white"
                    to={s.path}>
                    <span>Learn more</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -top-24 left-1/5 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" aria-hidden="true"></span>
          <span className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-indigo-400/12 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-6 rounded-3xl border border-slate-200/50" aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              What Our Patients Say
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Real experiences from our valued patients
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md p-5 shadow-lg flex flex-col gap-4 transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100 shadow-sm">
                    <img
                      src={t.avatar || doctorImg}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="text-base font-semibold text-slate-900">
                      {t.name}
                    </h5>
                    <div className="text-amber-400 text-sm flex">
                      {Array(t.rating)
                        .fill(0)
                        .map((_, idx) => (
                          <span key={idx}>★</span>
                        ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed italic">
                  "{t.feedback}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIST */}
      <section className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -top-24 left-1/5 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" aria-hidden="true"></span>
          <span className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-indigo-400/12 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-6 rounded-3xl border border-slate-200/50" aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Meet Our Specialist</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Expert healthcare professional leading our medical team
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.1fr,1.1fr] gap-10 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/40 opacity-80" aria-hidden="true"></div>
              <img
                src={doctorImg}
                alt="Dr. Okonkwo"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900">Dr. Okonkwo</h3>
              <p className="text-lg font-semibold text-blue-700">Lead Physician - Family Medicine</p>
              <p className="text-slate-700 font-medium">
                MBBS, MD - Family Medicine | 15+ Years Experience
              </p>

              <p className="text-slate-600 leading-relaxed">
                Dr. Okonkwo is a highly experienced family physician with a passion for providing comprehensive healthcare to patients of all ages. His expertise includes:
              </p>

              <ul className="space-y-2 text-slate-700">
                <li>✔ Comprehensive Family Healthcare</li>
                <li>✔ Preventive Medicine & Wellness</li>
                <li>✔ Chronic Disease Management</li>
                <li>✔ Patient Education & Counseling</li>
              </ul>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/appointment"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition duration-200">
                  Book Appointment
                </Link>
                <a
                  href="mailto:doctor@hopephysicians.com"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-full border border-blue-100 text-blue-700 bg-blue-50 font-semibold hover:-translate-y-0.5 hover:shadow-md transition duration-200">
                  📧 Email
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-full border border-slate-200 text-slate-700 bg-white font-semibold hover:-translate-y-0.5 hover:shadow-md transition duration-200">
                  🔗 LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT STAFF SECTION */}
      <section className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -top-24 left-1/5 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-6 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Support Team</h2>
            <p className="text-slate-200 max-w-2xl mx-auto">
              Dedicated professionals ensuring quality patient care
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur shadow-xl transition duration-200 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative aspect-[16/9] overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/60 opacity-90"
                />
                <img
                  src={medSupportImg}
                  alt="Medical Support Team"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105 saturate-[1.08] contrast-[1.05] brightness-[1.02]"
                />
              </div>
              <div className="flex flex-col gap-3 p-5 text-center">
                <h3 className="text-xl font-semibold text-white">Medical Support Team</h3>
                <p className="text-slate-200 leading-relaxed">
                  Our dedicated team of healthcare professionals working together to provide exceptional patient care
                </p>
              </div>
            </div>

            <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur shadow-xl transition duration-200 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative aspect-[16/9] overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/60 opacity-90"
                />
                <img
                  src={adminSupportImg}
                  alt="Administrative Support Team"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105 saturate-[1.08] contrast-[1.05] brightness-[1.02]"
                />
              </div>
              <div className="flex flex-col gap-3 p-5 text-center">
                <h3 className="text-xl font-semibold text-white">Administrative Support Team</h3>
                <p className="text-slate-200 leading-relaxed">
                  Our administrative staff ensuring smooth operations and excellent patient experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-14 md:py-16 reveal-on-scroll bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 -bottom-12 h-56 w-56 rounded-full bg-white/12 blur-3xl" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Book Your Appointment?
              </h2>
              <p className="text-blue-50 text-lg">
                We make booking simple — choose a time and see a specialist you trust.
              </p>
            </div>
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white text-blue-700 font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition duration-200">
              Book Appointment
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DISCLAIMER SECTION */}
      <section className="relative overflow-hidden py-12 reveal-on-scroll bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -top-20 left-1/4 h-60 w-60 rounded-full bg-blue-100/50 blur-3xl" aria-hidden="true"></span>
          <span className="absolute -bottom-24 right-1/5 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
            <h4 className="text-xl font-semibold text-blue-700 mb-4">Disclaimer</h4>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>
                The information provided on this website is for general informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website. In case of a medical emergency, call 911 immediately.
              </p>
              <p>
                Every person may respond differently to treatments, and results can vary from one patient to another. The information provided on this website should not be considered as a guarantee of specific results or outcomes.
              </p>
              <p className="mb-0">
                By using this site and sharing your information, you agree to let us contact you through email, phone, or other ways. We also keep track of visits and use data to help improve our services and marketing. Your privacy is important to us, and we handle your information in accordance with our privacy policy.
              </p>
            </div>
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
