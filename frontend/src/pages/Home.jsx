import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SEO from "../components/SEO";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    privacy: false,
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    try {
      // TODO: Connect to backend API when available
      // For now, simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
      setFormData({ name: "", email: "", message: "", privacy: false });
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const consultationItems = [
    {
      key: "hours",
      title: "Urgent Care Hours",
      lines: [
        "Mon - Thu: 8:00 AM - 5:00 PM",
        "Fri: 8:00 AM - 12:00 PM",
        "Walk-In Welcome",
      ],
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
      title: "Location & Contact",
      lines: [
        "2104 North Herritage Street",
        "Kinston, NC 28501",
        "Call: 252-522-3663",
      ],
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
      img: heroImg,
      title: "Urgent Care",
      desc: "Walk-in urgent care and immediate care services in Kinston, NC. No appointment needed. Located at 2104 North Herritage Street, Kinston, NC 28501.",
      path: "/urgent-care",
    },
    {
      img: familyImg,
      title: "Family Medicine",
      desc: "Comprehensive primary healthcare for individuals & families in Kinston, NC.",
      path: "/family-medicine",
    },
    {
      img: pediatricsImg,
      title: "Pediatric Care",
      desc: "Compassionate care for infants, children and adolescents in Kinston, NC.",
      path: "/pediatric-care",
    },
    {
      img: mensImg,
      title: "Men's Health",
      desc: "Preventive & specialized care for men in Kinston, NC.",
      path: "/mens-health",
    },
    {
      img: womensImg,
      title: "Women's Health",
      desc: "Gynecological and maternal health services in Kinston, NC.",
      path: "/womens-health",
    },
    {
      img: occupationalImg,
      title: "Occupational Health",
      desc: "Workplace health programmes & screenings in Kinston, NC.",
      path: "/occupational-health",
    },
    {
      img: geriatricImg,
      title: "Geriatric Care",
      desc: "Holistic senior care & chronic disease management in Kinston, NC.",
      path: "/geriatric-care",
    },
  ];

  // Slick Carousel Settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Gradient overlay colors for service cards
  const overlayGradients = [
    "bg-gradient-to-br from-primary/80 to-blue-700/80",
    "bg-gradient-to-br from-teal-500/80 to-teal-600/80",
    "bg-gradient-to-br from-indigo-500/80 to-indigo-600/80",
    "bg-gradient-to-br from-blue-600/80 to-primary/80",
    "bg-gradient-to-br from-cyan-500/80 to-teal-600/80",
    "bg-gradient-to-br from-primary/80 to-indigo-700/80",
    "bg-gradient-to-br from-teal-600/80 to-primary/80",
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
      <SEO
        title="Urgent Care in Kinston, NC | Immediate Care & Walk-In Clinic"
        description="Hope Physicians provides urgent care and immediate care services in Kinston, NC at 2104 North Herritage Street, Kinston, NC 28501. Walk-in urgent care welcome, no appointment needed. Family medicine, primary care physician services, and specialized medical care available."
        keywords={[
          "urgent care in Kinston",
          "Kinston urgent care",
          "urgent care near me Kinston",
          "immediate care Kinston",
          "walk-in clinic Kinston",
          "urgent care Kinston NC",
        ]}
      />
      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden py-16 md:py-24 reveal-on-scroll"
        role="banner"
        style={{
          backgroundImage: `url(${heroImg})`,
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
                  Urgent Care in Kinston, NC | Walk-In Immediate Care
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 reveal-on-scroll leading-relaxed">
                  Walk-in urgent care and immediate care services in Kinston,
                  NC. No appointment needed. Located at 2104 North Herritage
                  Street, Kinston, NC 28501. We also provide family medicine,
                  pediatric care, women's health, and geriatric care. We treat
                  your loved ones like family.
                </p>
                <Link
                  to="/appointment"
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 reveal-on-scroll">
                  <span>Visit Urgent Care - Walk-In Welcome</span>
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

              {/* Image Overlay Below */}
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"
                  aria-hidden="true"></div>
                <img
                  src={familyImg}
                  alt="Family Medicine physician providing primary care services at Hope Physicians in Kinston, NC"
                  className="w-full h-[300px] object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{ imageRendering: "high-quality", objectFit: "cover" }}
                />
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
                Hello & Welcome to Hope Physicians
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Leading the way in medical excellence with cutting-edge
                technology and compassionate care. Our primary care physicians
                provide comprehensive healthcare services including family
                medicine, urgent care, and immediate care for you and your
                family, ensuring quality medical care with a personal touch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION TIMING BANNER */}
      <section className="relative overflow-hidden py-12 md:py-14 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white -mt-12 rounded-b-[28px]">
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute -left-16 top-6 h-60 w-60 rounded-full bg-blue-500/25 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute inset-4 rounded-3xl border border-white/10 opacity-40"
            aria-hidden="true"></span>
          <span
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden="true"></span>
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center gap-3 text-center mb-8">
            <p className="text-white/80 text-sm md:text-base tracking-wide uppercase">
              Here when you need us
            </p>
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

      {/* MISSION STATEMENT */}
      <section
        id="about"
        className="relative overflow-hidden py-20 md:py-28 reveal-on-scroll bg-gray-50">
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          {/* Left: White Background */}
          <div className="bg-white p-10 md:p-16 flex items-center">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full w-fit mb-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                  Our Commitment
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Our Mission: Excellence in Primary Care & Family Medicine
              </h2>
            </div>
          </div>

          {/* Right: Blue Background with Pattern */}
          <div className="bg-primary relative p-10 md:p-16 flex items-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}></div>
            <div className="relative z-10 space-y-8 max-w-2xl">
              <p className="text-white/95 text-lg md:text-xl leading-relaxed">
                Leading the way in medical excellence with cutting-edge
                technology and compassionate care. Our primary care physicians
                are committed to providing comprehensive healthcare services
                including family medicine, urgent care, immediate care,
                pediatric care, women's health, geriatric care, and occupational
                health for you and your family, ensuring quality medical care
                with a personal touch. Our mission is to treat every patient
                with dignity, respect, and the highest standard of medical
                expertise.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                <span>About Us</span>
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
        </div>

        {/* Image Overlay */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
          <div className="max-w-md mx-auto lg:absolute lg:right-1/4 lg:top-1/2 lg:transform lg:-translate-y-1/2">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={aboutImg}
                alt="Primary care physician and doctors providing comprehensive healthcare services at Hope Physicians"
                className="w-full h-[350px] object-cover"
                loading="lazy"
                decoding="async"
                style={{ imageRendering: "high-quality", objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Care in Kinston Section */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                  Urgent Care Services
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Urgent Care in Kinston, NC
              </h2>
              <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
                Walk-in urgent care and immediate care services available. No
                appointment needed. Our expert physicians are ready to provide
                quality medical care when you need it most.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Location
                </h3>
                <p className="text-gray-700 text-lg mb-4">
                  <strong>2104 North Herritage Street</strong>
                  <br />
                  Kinston, NC 28501
                </p>
                <p className="text-gray-600">
                  Conveniently located in Kinston, North Carolina, providing
                  easy access to urgent care services for residents and
                  visitors.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact & Hours
                </h3>
                <p className="text-gray-700 text-lg mb-2">
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:252-522-3663"
                    className="text-primary hover:underline">
                    252-522-3663
                  </a>
                </p>
                <p className="text-gray-700 text-lg mb-4">
                  <strong>Fax:</strong> 252-522-3660
                </p>
                <p className="text-gray-600">
                  <strong>Hours:</strong> Mon - Thu: 8:00 AM - 5:00 PM | Fri:
                  8:00 AM - 12:00 PM
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Walk-In Welcome</h3>
              <p className="text-white/90 text-lg mb-6">
                No appointment needed for urgent care visits. Simply walk in
                during our business hours and receive prompt, professional
                medical attention.
              </p>
              <Link
                to="/appointment"
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                <span>Book Appointment or Walk-In</span>
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
        </div>
      </section>

      {/* Referral & Request Cards */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-32 lg:mt-0">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Physician Referral Form Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border border-primary/20">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Physician Referral Form
                </h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Refer patients for quality care and comprehensive medical
                services.
              </p>
            </div>

            {/* Request Card (Medical Teal) */}
            <Link
              to="/appointment"
              className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 block border border-teal-400/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Book Appointment
                </h3>
              </div>
              <p className="text-white/95 text-lg leading-relaxed">
                Schedule your visit with our expert medical team.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll revealed bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
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
                Why Choose Hope Physicians Primary Care?
              </h2>
              <p className="text-slate-200 text-lg leading-relaxed">
                Leading the way in medical excellence with cutting-edge
                technology and compassionate care. Our expert primary care
                physicians and doctors provide comprehensive family medicine,
                urgent care, and immediate care services.
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
                  24/7 Urgent Care & Immediate Care
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  Round-the-clock urgent care and immediate care services with
                  immediate response from our expert physicians
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
                  Expert Primary Care Physicians & Doctors
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  Team of experienced primary care physicians, doctors, and
                  healthcare professionals specializing in family medicine
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
        className="relative overflow-hidden py-20 md:py-28 reveal-on-scroll bg-primary">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <p className="text-white/90 text-sm uppercase tracking-wider font-semibold">
                What We Offer
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Urgent Care & Medical Services in Kinston, NC
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Walk-in urgent care and immediate care services in Kinston, NC at
              2104 North Herritage Street, Kinston, NC 28501. Comprehensive
              primary care physician services, family medicine, pediatric care,
              women's health, geriatric care, and occupational health for you
              and your family, delivered with compassion and expertise.
            </p>
          </div>

          {/* Services Carousel */}
          <div className="services-carousel-wrapper">
            <Slider {...carouselSettings}>
              {services.map((s, i) => (
                <div key={s.path} className="px-3">
                  <div className="support-service-box relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Image with Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <div
                        className={`service-overlay absolute inset-0 z-10 ${
                          overlayGradients[i % overlayGradients.length]
                        }`}></div>
                      <img
                        src={s.img}
                        alt={`${
                          s.title
                        } services at Hope Physicians - Primary care physician providing ${s.title.toLowerCase()}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        style={{
                          imageRendering: "high-quality",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    {/* Service Details */}
                    <div className="support-details absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                      <Link
                        to={s.path}
                        className="btn btn-white rounded-pill inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Get to know
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* View More Services Card */}
              <div className="px-3">
                <Link
                  to="/departments"
                  className="support-service-box relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 block">
                  <div className="relative h-64 overflow-hidden">
                    <div className="service-overlay absolute inset-0 z-10 bg-gradient-to-br from-teal-500/80 to-teal-600/80"></div>
                    <img
                      src={doctorImg}
                      alt="View all medical services at Hope Physicians"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      style={{
                        imageRendering: "high-quality",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="support-details absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-4">
                      View More Services
                    </h3>
                    <span className="btn btn-white rounded-pill inline-flex items-center gap-2 bg-white text-teal-600 font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                      Explore All
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative overflow-hidden py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute -top-24 left-1/5 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-indigo-400/12 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute inset-6 rounded-3xl border border-slate-200/50"
            aria-hidden="true"></span>
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
                      alt={`${t.name} - Patient testimonial for Hope Physicians primary care and family medicine services`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      style={{
                        imageRendering: "high-quality",
                        objectFit: "cover",
                      }}
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
          <span
            className="absolute -top-24 left-1/5 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-indigo-400/12 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute inset-6 rounded-3xl border border-slate-200/50"
            aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Meet Our Specialist
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Expert healthcare professional leading our medical team
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.1fr,1.1fr] gap-10 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/40 opacity-80"
                aria-hidden="true"></div>
              <img
                src={doctorImg}
                alt="Dr. Okonkwo - Primary care physician and family medicine doctor at Hope Physicians"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                style={{ imageRendering: "high-quality", objectFit: "cover" }}
              />
            </div>

            <div className="space-y-4 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900">Dr. Okonkwo</h3>
              <p className="text-lg font-semibold text-blue-700">
                Lead Physician - Family Medicine
              </p>
              <p className="text-slate-700 font-medium">
                MBBS, MD - Family Medicine | 15+ Years Experience
              </p>

              <p className="text-slate-600 leading-relaxed">
                Dr. Okonkwo is a highly experienced family physician with a
                passion for providing comprehensive healthcare to patients of
                all ages. His expertise includes:
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
          <span
            className="absolute -top-24 left-1/5 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute inset-6 rounded-3xl border border-white/5 opacity-40"
            aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Our Support Team
            </h2>
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
                  alt="Medical support team and healthcare professionals at Hope Physicians providing primary care and family medicine services"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  style={{ imageRendering: "high-quality", objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col gap-3 p-5 text-center">
                <h3 className="text-xl font-semibold text-white">
                  Medical Support Team
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Our dedicated team of healthcare professionals working
                  together to provide exceptional patient care
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
                  alt="Administrative support team at Hope Physicians assisting with primary care physician appointments and family medicine services"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  style={{ imageRendering: "high-quality", objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col gap-3 p-5 text-center">
                <h3 className="text-xl font-semibold text-white">
                  Administrative Support Team
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Our administrative staff ensuring smooth operations and
                  excellent patient experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-14 md:py-16 reveal-on-scroll bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute right-0 -bottom-12 h-56 w-56 rounded-full bg-white/12 blur-3xl"
            aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Book Your Appointment?
              </h2>
              <p className="text-blue-50 text-lg">
                We make booking simple — choose a time and see a specialist you
                trust.
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

      {/* CONTACT FORM SECTION */}
      <section className="relative overflow-hidden py-20 md:py-28 reveal-on-scroll bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                  Need Assistance?
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Message Us Today!
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We're here to help. Send us a message and we'll get back to you
                as soon as possible.
              </p>
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-3xl p-10 md:p-12 shadow-2xl space-y-6 border border-gray-100">
              {formStatus.message && (
                <div
                  className={`p-4 rounded-lg ${
                    formStatus.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}>
                  {formStatus.message}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Message
                </label>
                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-vertical bg-gray-50 focus:bg-white"
                  placeholder="Enter your message"></textarea>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={formData.privacy}
                  onChange={handleFormChange}
                  required
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  By submitting this form you agree to the terms of the{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* reCAPTCHA Placeholder */}
              <div className="bg-gray-200 rounded-lg p-4 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
                  <span>I'm not a Robot</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-teal-400 disabled:to-teal-500 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
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
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* DISCLAIMER SECTION */}
      <section className="relative overflow-hidden py-12 reveal-on-scroll bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute -top-20 left-1/4 h-60 w-60 rounded-full bg-blue-100/50 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute -bottom-24 right-1/5 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl"
            aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
            <h4 className="text-xl font-semibold text-blue-700 mb-4">
              Disclaimer
            </h4>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>
                The information provided on this website is for general
                informational purposes only and is not intended to be a
                substitute for professional medical advice, diagnosis, or
                treatment. Always seek the advice of your physician or other
                qualified health provider with any questions you may have
                regarding a medical condition. Never disregard professional
                medical advice or delay in seeking it because of something you
                have read on this website. In case of a medical emergency, call
                911 immediately.
              </p>
              <p>
                Every person may respond differently to treatments, and results
                can vary from one patient to another. The information provided
                on this website should not be considered as a guarantee of
                specific results or outcomes.
              </p>
              <p className="mb-0">
                By using this site and sharing your information, you agree to
                let us contact you through email, phone, or other ways. We also
                keep track of visits and use data to help improve our services
                and marketing. Your privacy is important to us, and we handle
                your information in accordance with our privacy policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING BUTTON */}
      <Link to="/appointment" className="floating-btn bounce-btn">
        <img
          src={appointmentIcon}
          alt="Book appointment with primary care physician at Hope Physicians"
          loading="lazy"
          decoding="async"
          style={{ imageRendering: "high-quality" }}
        />
        <span>Book Appointment</span>
      </Link>
    </>
  );
};

export default Home;
