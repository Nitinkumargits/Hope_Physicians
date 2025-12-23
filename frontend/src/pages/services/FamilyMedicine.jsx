import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

  // Carousel configuration - 1 slide at a time, each slide contains multiple items
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

  // Group services into chunks of 10 items per slide
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

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

  const handleBook = (serviceLabel) => {
    navigate(`/appointment?service=${encodeURIComponent(serviceLabel)}`);
  };

  const handleLearnMore = (serviceLabel) => {
    navigate(`/contact?topic=${encodeURIComponent(serviceLabel)}`);
  };

  // Render SVG icon for each department
  const renderDeptIcon = (iconKey) => {
    const stroke = "#1e3a8a";
    const strokeWidth = "1.5";

    switch (iconKey) {
      case "acute":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case "diabetes":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        );
      case "hypertension":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case "kidney":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 2v20M15 2v20M3 7h6M15 7h6M3 17h6M15 17h6" />
          </svg>
        );
      case "cardiac":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case "neuro":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2 18.5a2.5 2.5 0 0 1 0-5l5.04-1.44A2.5 2.5 0 0 1 9.5 2z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44L22 18.5a2.5 2.5 0 0 0 0-5l-5.04-1.44A2.5 2.5 0 0 0 14.5 2z" />
          </svg>
        );
      case "stroke":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case "neuropathy":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
          </svg>
        );
      case "heart-failure":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        );
      case "pulmonary":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0z" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        );
      case "sleep-apnea":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M7 8h10M7 12h10M7 16h5" />
          </svg>
        );
      case "copd":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <path d="M3 12h18" />
          </svg>
        );
      case "asthma":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0z" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        );
      case "thyroid":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case "depression":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
          </svg>
        );
      case "anxiety":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
          </svg>
        );
      case "gastro":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
            <path d="M6 3v18M18 3v18" />
            <circle cx="9" cy="9" r="1" />
            <circle cx="15" cy="9" r="1" />
            <circle cx="9" cy="15" r="1" />
            <circle cx="15" cy="15" r="1" />
          </svg>
        );
      case "infectious":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case "skin":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case "orthopedic":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <path d="M8 8l4-4 4 4M8 16l4 4 4-4" />
          </svg>
        );
      case "arthritis":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case "trigger-point":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case "cortisone":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case "weight":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M6 2h12M6 22h12M6 2v20M18 2v20M9 6h6M9 10h6M9 14h6M9 18h6" />
          </svg>
        );
      case "surgery":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <path d="M8 8l2-2M16 8l-2-2M8 16l2 2M16 16l-2 2" />
          </svg>
        );
      case "mens-health":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        );
      case "womens-health":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <circle cx="10" cy="12" r="1" />
            <circle cx="14" cy="12" r="1" />
          </svg>
        );
      case "pediatric":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="8" r="3" />
            <path d="M5 20c0-2.5 2-4.5 4.5-4.5h5c2.5 0 4.5 2 4.5 4.5" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        );
      case "preventative":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        );
      case "well-child":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="8" r="3" />
            <path d="M5 20c0-2.5 2-4.5 4.5-4.5h5c2.5 0 4.5 2 4.5 4.5" />
            <path d="M9 12h6M12 9v6" />
          </svg>
        );
      case "wellness":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <circle cx="12" cy="12" r="2" />
            <path d="M8 8l4-4 4 4M8 16l4 4 4-4" />
          </svg>
        );
      case "immunizations":
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      default:
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        );
    }
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

  const whyCards = [
    {
      key: "emergency",
      title: "24/7 Emergency Care",
      copy: "Round-the-clock emergency services with immediate response.",
      tone: "blue",
    },
    {
      key: "experts",
      title: "Expert Doctors",
      copy: "Team of experienced specialists and healthcare professionals.",
      tone: "blue",
    },
    {
      key: "tech",
      title: "Advanced Technology",
      copy: "State-of-the-art medical equipment and facilities.",
      tone: "blue",
    },
    {
      key: "patient",
      title: "Patient-Centric",
      copy: "Focused on providing the best patient care experience.",
      tone: "rose",
    },
  ];

  const whyStats = [
    { label: "Response", value: "24/7" },
    { label: "Specialists", value: "Expert-led" },
    { label: "Experience", value: "Patient-first" },
  ];

  const renderWhyIcon = (key, tone = "blue") => {
    const stroke = tone === "rose" ? "#fb7185" : "#93c5fd";
    switch (key) {
      case "emergency":
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
            <circle cx="12" cy="12" r="9"></circle>
            <polyline points="12 7 12 12 15 14"></polyline>
          </svg>
        );
      case "experts":
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
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M6 20c0-3.333 2.667-5 6-5s6 1.667 6 5"></path>
          </svg>
        );
      case "tech":
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
            <path d="M10 3h4"></path>
            <path d="M12 3v9"></path>
            <path d="M8 12h8"></path>
            <path d="M7 19h10"></path>
            <path d="M9 12v7"></path>
            <path d="M15 12v7"></path>
          </svg>
        );
      case "patient":
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
            <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredServices = services.filter((s) =>
    s.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Group filtered services into slides of 10 items each
  const serviceSlides = chunkArray(
    filteredServices.length ? filteredServices : services,
    10
  );

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden py-16 md:py-24 reveal-on-scroll"
        role="banner"
        style={{
          backgroundImage: `url(${familyImg})`,
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
                  Family Medicine
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 reveal-on-scroll leading-relaxed">
                  Comprehensive primary healthcare for individuals and families
                  of all ages. Our experienced family physicians serve as your
                  primary healthcare partners, coordinating care and building
                  long-term relationships with you and your family.
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
                Your Family's Health Partner
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We focus on preventive care, health maintenance, and the
                treatment of acute and chronic conditions for patients of all
                ages.
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
              Comprehensive Family Healthcare
            </h2>
            <div className="max-w-3xl mx-auto text-left space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                At Hope Physicians, our Family Medicine department provides
                comprehensive, patient-centered primary care for individuals and
                families across all stages of life. We focus on preventive care,
                health maintenance, and the treatment of acute and chronic
                conditions.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our experienced family physicians serve as your primary
                healthcare partners, coordinating care and building long-term
                relationships with you and your family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OFFERED */}
      <section
        className="relative py-20 md:py-28 reveal-on-scroll"
        style={{ background: "#f0f9ff" }}>
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
          <div className="department-carousel-wrapper">
            <div className="dept-carousel-container">
              <Slider {...departmentCarouselSettings}>
                {serviceSlides.map((slide, slideIndex) => (
                  <div key={slideIndex}>
                    <div className="departments-row">
                      {slide.map((item) => (
                        <a
                          key={item.key}
                          href="#"
                          className="dept-item"
                          onClick={(e) => {
                            e.preventDefault();
                            handleBook(item.label);
                          }}
                          onMouseEnter={() => setHovered(item.key)}
                          onMouseLeave={() => setHovered(null)}>
                          <div className="dept-icon">
                            {renderDeptIcon(item.key)}
                          </div>
                          <div className="title2">{item.label}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
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

      {/* BENEFITS */}
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
          <div className="grid gap-10 lg:grid-cols-[1fr,1.3fr] items-start">
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
                {whyStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-xs uppercase text-slate-300">
                      {stat.label}
                    </div>
                    <div className="text-lg font-semibold text-blue-100">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {whyCards.map((card) => (
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
        </div>
      </section>

      {/* CTA */}
      <section className="cta-enhanced relative overflow-hidden py-14 md:py-16 reveal-on-scroll bg-slate-50">
        <div className="pointer-events-none absolute inset-0"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cta-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="cta-copy space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Ready to Schedule Your Family's Healthcare?
              </h2>
              <p className="text-slate-600 text-lg">
                Book an appointment with our family medicine team today.
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

export default FamilyMedicine;
