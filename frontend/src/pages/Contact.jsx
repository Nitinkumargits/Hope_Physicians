import React, { useEffect } from "react";
import '../styles/Contact.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import heroImg from "../assets/images/hero2.jpg";

const Contact = () => {
  const contactCards = [
    {
      key: "location",
      title: "Our Location",
      lines: ["Hope Physicians Medical Center,", "Ojoto, Anambra State, Nigeria"],
      icon: <FaMapMarkerAlt size={24} color="#fff" />,
    },
    {
      key: "phone",
      title: "Phone Numbers",
      lines: ["+234 900 000 0000", "+234 901 111 1111"],
      icon: <FaPhoneAlt size={24} color="#fff" />,
    },
    {
      key: "email",
      title: "Email Us",
      lines: ["hopephysician90@gmail.com", "support@hopephysicians.com"],
      icon: <FaEnvelope size={24} color="#fff" />,
    },
  ];

  useEffect(() => {
    document.title = "Contact Us — Hope Physicians";

    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(r => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section contact-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container reveal-on-scroll">
          <h1>Contact Us</h1>
          <p>We’re here to assist you with any questions or appointment needs.</p>
          <div className="hero-ctas">
            <a href="#contact-form" className="hero-btn">Send Message</a>
            <a href="/" className="hero-ghost">Home</a>
          </div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="relative overflow-hidden py-14 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-6 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
          <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true"></span>
        </div>
        <div className="container relative z-10">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Get in touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Contact Information</h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
              Reach us anytime for appointments, emergencies, or general inquiries.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {contactCards.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.32)] flex flex-col gap-3">
                <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-white/10 border border-white/15 shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
                  <span className="absolute inset-0 rounded-full bg-white/10 blur-lg"></span>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="text-slate-200 text-base leading-relaxed m-0 space-y-1">
                  {card.lines.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section
        id="contact-form"
        className="relative overflow-hidden py-16 md:py-20 bg-white text-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-100 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-100 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-6 rounded-3xl border border-slate-200/70 opacity-80" aria-hidden="true"></span>
        </div>
        <div className="container relative z-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr] items-start">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)] p-6 md:p-7">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-700 mb-1">
                    Quick response
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Send Us a Message
                  </h2>
                  <p className="text-slate-600 mt-1">
                    We respond as quickly as possible.
                  </p>
                </div>
                <div className="h-12 px-4 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold flex items-center gap-2">
                  <i className="fas fa-headset"></i>
                  Live support
                </div>
              </div>
              <form className="grid gap-4 md:gap-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-700 font-semibold">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Jane"
                      required
                      className="rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-700 font-semibold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      required
                      className="rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-700 font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-700 font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+234 900 000 0000"
                      required
                      className="rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-slate-700 font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help you?"
                    required
                    className="rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-slate-700 font-semibold">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Your message..."
                    required
                    className="rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/70 resize-none"
                  ></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-3 transition shadow-[0_14px_30px_rgba(59,130,246,0.25)]">
                    <i className="fas fa-paper-plane me-2"></i>
                    Send Message
                  </button>
                  <a
                    href="tel:252-522-3663"
                    className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 text-blue-700 font-semibold text-sm px-4 py-3 transition hover:bg-blue-50">
                    <i className="fas fa-phone-alt me-2"></i>
                    Call Now
                  </a>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)] overflow-hidden">
              <div className="h-64 md:h-full w-full">
                <iframe
                  title="Hope Physicians Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.1234567890123!2d-77.5812!3d35.2627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDE1JzQ1LjciTiA3N8KwMzQnNTIuMyJX!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
              <div className="p-5 space-y-3 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900 m-0">
                    Office Hours
                  </h4>
                  <span className="inline-flex items-center gap-2 text-xs uppercase font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                    <i className="fas fa-clock"></i>
                    Updated
                  </span>
                </div>
                <ul className="space-y-2 text-slate-700 text-sm m-0">
                  <li className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span>Monday - Thursday</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span>Friday</span>
                    <span>8:00 AM - 12:00 PM</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Saturday - Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
