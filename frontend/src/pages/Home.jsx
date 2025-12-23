import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SEO from "../components/SEO";
import "../styles/Home.css";

import aboutImg from "../assets/images/about.jpg";
import familyImg from "../assets/images/family.jpeg";
import mensImg from "../assets/images/mens.jpeg";
import womensImg from "../assets/images/women.jpeg";
import doctorImg from "../assets/images/doctor.jpg";
import appointmentIcon from "../assets/images/appointment-icon.webp";
import medSupportImg from "../assets/images/med_support.jpg";
import adminSupportImg from "../assets/images/admin_support.jpg";
import urgentCareImg from "../assets/images/urgent-care.jpg";
import familyMedicineImg from "../assets/images/family-medicine.jpg";
import pediatricCareImg from "../assets/images/pediatric-care.jpg";
import mensHealthImg from "../assets/images/mens-health.jpg";
import womensHealthImg from "../assets/images/womens-health.jpg";
import occupationalHealthImg from "../assets/images/occupational-health.jpg";
import geriatricCareImg from "../assets/images/geriatric-care.jpg";
import viewMoreServicesImg from "../assets/images/view-more-services.jpg";

const Home = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  // Hero carousel images from Unsplash (hospital/medical related) - optimized URLs
  const heroImages = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1920&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1920&q=85&auto=format&fit=crop",
  ];

  // Hero carousel settings - enhanced with smoother transitions
  const heroCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnFocus: false,
    fade: true,
    arrows: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    adaptiveHeight: false,
    lazyLoad: "ondemand",
    swipe: true,
    touchMove: true,
    waitForAnimate: true,
  };

  // Services carousel settings and data (mirrors department carousel UX)
  const departmentCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    arrows: true,
  };

  const serviceSlides = [
    [
      {
        title: "Annual Wellness Exams",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        ),
      },
      {
        title: "Immunizations",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        ),
      },
      {
        title: "Diabetes Management",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
        ),
      },
      {
        title: "Hypertension",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        ),
      },
      {
        title: "Chronic Kidney Disease",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 2v20M15 2v20M3 7h6M15 7h6M3 17h6M15 17h6"></path>
          </svg>
        ),
      },
      {
        title: "Coronary Artery Disease",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        ),
      },
      {
        title: "Neurological Diseases",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2 18.5a2.5 2.5 0 0 1 0-5l5.04-1.44A2.5 2.5 0 0 1 9.5 2z"></path>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44L22 18.5a2.5 2.5 0 0 0 0-5l-5.04-1.44A2.5 2.5 0 0 0 14.5 2z"></path>
          </svg>
        ),
      },
      {
        title: "Stroke",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        ),
      },
      {
        title: "Neuropathy",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
          </svg>
        ),
      },
      {
        title: "Congestive Heart Failure",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            <path d="M12 8v8M8 12h8"></path>
          </svg>
        ),
      },
    ],
    [
      {
        title: "Obstructive Sleep Apnea",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="M7 8h10M7 12h10M7 16h5"></path>
          </svg>
        ),
      },
      {
        title: "COPD",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            <path d="M3 12h18"></path>
          </svg>
        ),
      },
      {
        title: "Asthma",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0z"></path>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
          </svg>
        ),
      },
      {
        title: "Thyroid Disorders",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="M7 8h10M7 12h10M7 16h5"></path>
          </svg>
        ),
      },
      {
        title: "Depression",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"></path>
          </svg>
        ),
      },
      {
        title: "Anxiety",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18"></path>
            <path d="M6 3v18M18 3v18"></path>
            <circle cx="9" cy="9" r="1"></circle>
            <circle cx="15" cy="9" r="1"></circle>
            <circle cx="9" cy="15" r="1"></circle>
            <circle cx="15" cy="15" r="1"></circle>
          </svg>
        ),
      },
      {
        title: "Gastrointestinal Diseases",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2v20M2 12h20"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        ),
      },
      {
        title: "Infectious Diseases",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        ),
      },
      {
        title: "Skin Diseases",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M2 12h20"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        ),
      },
      {
        title: "Pulmonary Diseases",
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
          </svg>
        ),
      },
    ],
  ];

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setFormStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { submitContactForm } = await import("../services/contactService");
      const result = await submitContactForm(formData);

      if (result.success) {
        setFormStatus({
          type: "success",
          message:
            "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setFormStatus({
          type: "error",
          message:
            result.error || "Failed to send message. Please try again later.",
        });
      }
    } catch (err) {
      setFormStatus({
        type: "error",
        message: err?.message || "An error occurred. Please try again later.",
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

  // Services (drives the dynamic Services section)
  const services = [
    {
      img: urgentCareImg,
      title: "Urgent Care",
      desc: "Walk-in urgent care and immediate care services in Kinston, NC. No appointment needed. Located at 2104 North Herritage Street, Kinston, NC 28501.",
      path: "/urgent-care",
    },
    {
      img: familyMedicineImg,
      title: "Family Medicine",
      desc: "Comprehensive primary healthcare for individuals & families in Kinston, NC.",
      path: "/family-medicine",
    },
    {
      img: pediatricCareImg,
      title: "Pediatric Care",
      desc: "Compassionate care for infants, children and adolescents in Kinston, NC.",
      path: "/pediatric-care",
    },
    {
      img: mensHealthImg,
      title: "Men's Health",
      desc: "Preventive & specialized care for men in Kinston, NC.",
      path: "/mens-health",
    },
    {
      img: womensHealthImg,
      title: "Women's Health",
      desc: "Gynecological and maternal health services in Kinston, NC.",
      path: "/womens-health",
    },
    {
      img: occupationalHealthImg,
      title: "Occupational Health",
      desc: "Workplace health programmes & screenings in Kinston, NC.",
      path: "/occupational-health",
    },
    {
      img: geriatricCareImg,
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

  // Testimonials Carousel Settings
  const testimonialsCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
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

  const testimonials = [
    {
      name: "Brenda Watson",
      feedback:
        "Dr. Okonkwo is an awesome doctor that is willing to listen to me about my health concerns. Most importantly, he believes in me as a patient and gives me an opportunity to get healthier with medication or without. I feel comfortable talking with him because he listens to me.",
      rating: 5,
      avatar: womensImg,
      year: "2024",
    },
    {
      name: "Lu McMurtry",
      feedback:
        "Very friendly staff. Always knows my Mom's name and makes her feel welcome. The wait time to see the doctor can be long, but he does a good job listening to her concerns once he is with her. Most doctors want to get you in and out, but I hear him with his patients asking questions and listening to what is bothering them. When I take my Mom for her appointment with him, I plan my day accordingly. Yes, it may be a long day at the doctor's office, but I like the attentiveness he gives to her needs. So waiting to get that type of service, I don't mind.",
      rating: 5,
      avatar: familyImg,
      year: "2024",
    },
    {
      name: "Deacon Hull",
      feedback:
        "The facility is a little dated; however, the professionalism and courtesy of the staff is exceptional. My wife had called just about every physician in town and everyone was full. The receptionist was caring and 'fit' me in the next day due to the severity of my condition. None of the other offices would. The wait was a little long, but I saw so many patients coming out who had been seen before me. All of the patients looked satisfied, and I was impressed with the fact that many of the patients knew the staff by name. It caused me to reminisce of my childhood when our family physician knew us by name and cared. Hats off to Hope Physicians for outstanding customer service in an age of impatience.",
      rating: 5,
      avatar: mensImg,
      year: "2024",
    },
    {
      name: "Sarah Mitchell",
      feedback:
        "I've been bringing my children to Hope Physicians for pediatric care for over three years now. The doctors are patient, thorough, and truly care about my kids' wellbeing. The staff always makes us feel welcome, and I appreciate how they take time to explain everything clearly. Highly recommend for families in Kinston!",
      rating: 5,
      avatar: familyImg,
      year: "2025",
    },
    {
      name: "James Thompson",
      feedback:
        "As someone who needs regular check-ups for chronic conditions, I appreciate the comprehensive care I receive here. Dr. Okonkwo and his team are knowledgeable, professional, and always available when I need urgent care. The walk-in option is a lifesaver for unexpected health issues.",
      rating: 5,
      avatar: mensImg,
      year: "2025",
    },
    {
      name: "Maria Rodriguez",
      feedback:
        "The women's health services at Hope Physicians are exceptional. The staff is respectful, understanding, and provides excellent care. I feel comfortable discussing any health concerns, and I always leave feeling well-informed about my health. Thank you for providing such compassionate healthcare in our community.",
      rating: 5,
      avatar: womensImg,
      year: "2025",
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
      {/* HERO SECTION - CAROUSEL */}
      <section
        className="relative overflow-hidden py-16 md:py-20 lg:py-24 reveal-on-scroll hero-carousel-section"
        role="banner">
        <Slider {...heroCarouselSettings} className="hero-carousel">
          {heroImages.map((imageUrl, index) => (
            <div key={index}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}>
                <div className="hero-overlay"></div>
                <div className="hero-overlay-pattern" aria-hidden="true"></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                  <div className="grid gap-6 md:gap-8 lg:grid-cols-2 items-center w-full py-8 md:py-12">
                    {/* Left: Primary Content Card */}
                    <div className="space-y-6 hero-content-left">
                      <article className="hero-primary-card">
                        <h1 className="hero-title">
                          Urgent Care in Kinston, NC | Walk-In Immediate Care
                        </h1>
                        <p className="hero-description">
                          Walk-in urgent care and immediate care services in
                          Kinston, NC. No appointment needed. Located at 2104
                          North Herritage Street, Kinston, NC 28501. We also
                          provide family medicine, pediatric care, women's
                          health, and geriatric care. We treat your loved ones
                          like family.
                        </p>
                        <Link to="/appointment" className="hero-cta-button">
                          <span>Visit Urgent Care - Walk-In Welcome</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </Link>
                      </article>
                    </div>

                    {/* Right: Welcome Card & Image */}
                    <div className="space-y-6 hero-content-right">
                      <article className="hero-welcome-card">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        </div>
                        <h2 className="hero-welcome-title">
                          Hello & Welcome to Hope Physicians
                        </h2>
                        <p className="hero-welcome-text">
                          Leading the way in medical excellence with
                          cutting-edge technology and compassionate care. Our
                          primary care physicians provide comprehensive
                          healthcare services including family medicine, urgent
                          care, and immediate care for you and your family,
                          ensuring quality medical care with a personal touch.
                        </p>
                      </article>

                      {/* Image Card */}
                      <div className="hero-image-card">
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"
                          aria-hidden="true"></div>
                        <img
                          src={familyImg}
                          alt="Family Medicine physician providing primary care services at Hope Physicians in Kinston, NC"
                          className="w-full h-[280px] md:h-[300px] object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* CONSULTATION TIMING BANNER */}
      <section className="relative overflow-hidden py-12 md:py-14 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white -mt-12 rounded-b-[28px]">
        <div className="pointer-events-none absolute inset-0">
          {/* Structured decorative boxes matching reference style */}
          <div
            className="absolute left-0 top-0 w-32 h-32 rounded-2xl bg-blue-500/20 border border-white/15 opacity-60"
            aria-hidden="true"></div>
          <div
            className="absolute left-8 top-16 w-24 h-24 rounded-xl bg-blue-400/15 border border-white/10 opacity-50"
            aria-hidden="true"></div>
          <div
            className="absolute right-0 bottom-0 w-40 h-40 rounded-2xl bg-indigo-500/20 border border-white/15 opacity-60"
            aria-hidden="true"></div>
          <div
            className="absolute right-8 bottom-16 w-28 h-28 rounded-xl bg-indigo-400/15 border border-white/10 opacity-50"
            aria-hidden="true"></div>
          {/* Structured border frame */}
          <div
            className="absolute inset-4 rounded-2xl border-2 border-white/20 opacity-50"
            aria-hidden="true"></div>
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            aria-hidden="true"></div>
          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden="true"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col gap-0">
            {/* Contact Numbers Banner */}
            <div className="w-full mb-6">
              <div className="newnum box_bg_1">
                <div className="lefttext">
                  Our Contact Numbers Have Changed
                  <span>To contact us please call on these numbers.</span>
                </div>
                <div className="right-num">252-522-3663</div>
              </div>
            </div>

            {/* Service Boxes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0">
              <div className="md:col-span-1">
                <div className="service-box box_bg_1 box-bor-rdius-1">
                  <span className="icon-22">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"></circle>
                      <polyline points="12 7 12 12 15 14"></polyline>
                    </svg>
                  </span>
                  <div className="title1">Urgent Care Hours</div>
                  <p>
                    {consultationItems[0].lines.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < consultationItems[0].lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <Link to="/appointment" className="text-btn">
                    Read more
                  </Link>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="service-box box_bg_2">
                  <span className="icon-20 ">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 9.8 19.8 19.8 0 0 1 .08 1.18 2 2 0 0 1 2.05-.99h3a2 2 0 0 1 2 1.72c.12.92.37 1.82.73 2.67a2 2 0 0 1-.45 2.11L6.1 6.89a16 16 0 0 0 7 7l1.37-1.22a2 2 0 0 1 2.11-.45c.85.36 1.75.61 2.67.73A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </span>
                  <div className="title1">Emergency Contact</div>
                  <p>
                    {consultationItems[1].lines.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < consultationItems[1].lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <Link to="/contact" className="text-btn">
                    Read more
                  </Link>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="service-box box_bg_3">
                  <span className="icon-20">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div className="title1">Location & Contact</div>
                  <p>
                    {consultationItems[2].lines.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < consultationItems[2].lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <Link to="/contact" className="text-btn">
                    Read more
                  </Link>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="service-box box_bg_4 box-bor-rdius-2">
                  <span className="icon-23">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                      <path d="M16 2v4"></path>
                      <path d="M8 2v4"></path>
                      <path d="M3 10h18"></path>
                    </svg>
                  </span>
                  <div className="title1">Appointment Schedule</div>
                  <hr />
                  <Link to="/appointment" className="text-btn">
                    Book Appointment <i className="las la-arrow-right"></i>
                  </Link>
                  <p>
                    For appointments <br /> Call: 252-522-3663
                  </p>
                  <hr />
                  <Link to="/contact" className="text-btn">
                    Contact Us <i className="las la-arrow-right"></i>
                  </Link>
                  <p>We're here to help you</p>
                </div>
              </div>
            </div>
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
                className="cta-primary-btn inline-flex items-center justify-center px-5 py-3 rounded-full font-semibold transition duration-200">
                <span>Book Appointment or Walk-In</span>
                <span className="cta-arrow ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Departments Carousel Section */}
      <section
        className="relative overflow-hidden py-20 md:py-28 reveal-on-scroll"
        style={{ background: "rgb(240, 249, 255)" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                What We Offer
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Our Services
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Comprehensive medical care tailored to your family's needs
            </p>
          </div>

          {/* Search Bar */}
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
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "4px",
                  boxShadow:
                    "rgba(15, 23, 42, 0.08) 0px 4px 20px, rgba(255, 255, 255, 0.9) 0px 1px 0px inset",
                  border: "1px solid rgba(226, 232, 240, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "0.3s",
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
                    aria-hidden="true"
                    style={{
                      color: "rgb(15, 23, 42)",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}></i>
                  <span
                    style={{
                      color: "rgb(71, 85, 105)",
                      fontSize: "15px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}>
                    Search services
                  </span>
                </div>
                <input
                  placeholder="Search services..."
                  aria-label="Search services"
                  type="search"
                  style={{
                    flex: "1 1 0%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    padding: "14px 16px 14px 0px",
                    fontSize: "15px",
                    color: "rgb(15, 23, 42)",
                    fontWeight: 400,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Departments Carousel */}
          <div className="department-carousel-wrapper">
            <div className="dept-carousel-container">
              <Slider {...departmentCarouselSettings}>
                {serviceSlides.map((slide, slideIndex) => (
                  <div key={slideIndex}>
                    <div className="departments-row">
                      {slide.map((service, idx) => (
                        <Link
                          key={idx}
                          to={service.link || "#"}
                          className="dept-item">
                          <div className="dept-icon">{service.icon}</div>
                          <div className="title2">{service.title}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* CTA below carousel */}
          <div className="department-carousel-cta">
            <Link
              to="/departments"
              className="view-all-services-btn inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <span>View All Services</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
              {services.map((s) => (
                <div key={s.path} className="px-3">
                  <div className="support-service-box relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
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
                      <h3 className="text-2xl font-bold mb-4 text-left w-full mt-3">
                        {s.title}
                      </h3>
                      <Link
                        to={s.path}
                        className="btn btn-white rounded-pill inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl text-left">
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
                    <img
                      src={viewMoreServicesImg}
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
                    <h3 className="text-0.5xl font-bold mb-4 text-left w-full mt-5">
                      View More Services
                    </h3>
                    <span className="btn btn-white rounded-pill inline-flex items-center gap-2 bg-white text-teal-600 font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl text-left">
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
          <div className="patient-stories-band" aria-hidden="true"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Patient Stories
            </h2>
          </div>

          <div className="patient-stories testimonials-carousel-wrapper">
            <Slider {...testimonialsCarouselSettings}>
              {testimonials.map((t, i) => (
                <div key={i}>
                  <div className="stories-item">
                    <div className="quote-badge">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                          fill="#ffffff"
                        />
                        <path
                          d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                          fill="#ffffff"
                        />
                      </svg>
                    </div>
                    <p className="story-text">{t.feedback}</p>
                    <div className="title2 story-name">{t.name}</div>
                    <span className="story-year">{t.year || "2024"}</span>
                    <a
                      className="view-details"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTestimonial(t);
                      }}
                      data-description={t.feedback}
                      data-patientname={t.name}
                      data-recorddate={t.year || "2024"}>
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </Slider>
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
                  className="cta-primary-btn inline-flex items-center justify-center px-5 py-3 rounded-full font-semibold transition duration-200">
                  <span>Book Appointment</span>
                  <span className="cta-arrow ml-2">→</span>
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
            className="absolute -top-24 left-1/5 h-80 w-80 rounded-full bg-blue-500/16 blur-3xl"
            aria-hidden="true"></span>
          <span
            className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-indigo-500/14 blur-3xl"
            aria-hidden="true"></span>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Our Support Team
            </h2>
            <p className="text-slate-200 max-w-2xl mx-auto">
              Dedicated professionals ensuring quality patient care
            </p>
          </div>

          <div className="support-ref-grid">
            <div className="support-ref-left">
              <div className="support-title-vertical">Quick Reference</div>

              <div className="support-quick-box top-bor">
                <div className="support-ward-type">
                  <span>Medical Support Team</span>
                  Our dedicated team of healthcare professionals working
                  together to provide exceptional patient care
                </div>
                <div className="support-access-row">
                  <Link to="/appointment">Make Appointment</Link>
                  <Link
                    to="/appointment"
                    aria-label="make appointment"
                    className="support-round-btn">
                    →
                  </Link>
                </div>
              </div>

              <div className="support-quick-box">
                <div className="support-ward-type">
                  <span>Administrative Support Team</span>
                  Our administrative staff ensuring smooth operations and
                  excellent patient experience
                </div>
                <div className="support-access-row">
                  <Link to="/appointment">Contact Team</Link>
                  <Link
                    to="/appointment"
                    aria-label="contact team"
                    className="support-round-btn">
                    →
                  </Link>
                </div>
              </div>
            </div>

            <div className="support-ref-right">
              <div className="support-gallery">
                <div className="support-gallery-item">
                  <Link to="/appointment">
                    <div className="content-overlay"></div>
                    <img
                      src={medSupportImg}
                      alt="Medical support team and healthcare professionals at Hope Physicians providing primary care and family medicine services"
                      loading="lazy"
                      decoding="async"
                      className="support-gallery-img"
                      style={{
                        imageRendering: "high-quality",
                        objectFit: "cover",
                      }}
                    />
                    <div className="content-details">
                      <span>Medical Support Team</span>
                    </div>
                  </Link>
                </div>
                <div className="support-gallery-item">
                  <Link to="/appointment">
                    <div className="content-overlay"></div>
                    <img
                      src={adminSupportImg}
                      alt="Administrative support team at Hope Physicians assisting with primary care physician appointments and family medicine services"
                      loading="lazy"
                      decoding="async"
                      className="support-gallery-img"
                      style={{
                        imageRendering: "high-quality",
                        objectFit: "cover",
                      }}
                    />
                    <div className="content-details">
                      <span>Administrative Support Team</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
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
                Ready to Book Your Appointment?
              </h2>
              <p className="text-slate-600 text-lg">
                We make booking simple — choose a time and see a specialist you
                trust.
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

      {/* CONTACT FORM SECTION */}
      <section className="relative overflow-hidden py-20 md:py-28 reveal-on-scroll bg-gradient-to-b from-gray-50 to-white">
        {/* ECG / Heartbeat background animation - Full width */}
        <div className="ecg-overlay-full" aria-hidden="true">
          <svg
            className="ecg-svg-full"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none">
            <defs>
              <linearGradient
                id="ecg-grad-full"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%">
                <stop offset="0%" stopColor="rgba(220,38,38,0.6)" />
                <stop offset="25%" stopColor="rgba(14,165,233,0.6)" />
                <stop offset="50%" stopColor="rgba(34,197,94,0.6)" />
                <stop offset="75%" stopColor="rgba(14,165,233,0.6)" />
                <stop offset="100%" stopColor="rgba(220,38,38,0.6)" />
              </linearGradient>
            </defs>
            <path
              className="ecg-path-full"
              d="M0 200 L100 200 L120 160 L140 240 L160 120 L180 280 L220 200 L280 200 L300 140 L320 260 L340 180 L380 200 L440 200 L460 120 L480 300 L500 220 L560 200 L640 200 L660 140 L680 260 L700 180 L760 200 L840 200 L860 120 L880 300 L900 220 L960 200 L1040 200 L1060 140 L1080 260 L1100 180 L1160 200 L1240 200 L1260 140 L1280 260 L1300 180 L1360 200 L1440 200"
              fill="none"
              stroke="url(#ecg-grad-full)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="+234 900 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="How can we help you?"
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

      {/* TESTIMONIAL MODAL */}
      {selectedTestimonial && (
        <div
          className="testimonial-modal-overlay"
          onClick={() => setSelectedTestimonial(null)}>
          <div
            className="testimonial-modal-content"
            onClick={(e) => e.stopPropagation()}>
            <button
              className="testimonial-modal-close"
              onClick={() => setSelectedTestimonial(null)}>
              ×
            </button>
            <div className="testimonial-modal-quote">
              <div className="quote-badge">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                    fill="#ffffff"
                  />
                  <path
                    d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
            </div>
            <p className="testimonial-modal-text">
              {selectedTestimonial.feedback}
            </p>
            <div className="testimonial-modal-footer">
              <div className="title2">{selectedTestimonial.name}</div>
              <span>{selectedTestimonial.year || "2024"}</span>
            </div>
          </div>
        </div>
      )}

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
