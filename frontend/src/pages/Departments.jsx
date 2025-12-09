import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { submitAppointment } from '../api/appointmentApi';
import heroImg from "../assets/images/hero2.jpg";
import doctorImg from "../assets/images/doctor.jpg";
import familyImg from "../assets/images/family.jpeg";
import pediatricsImg from "../assets/images/pediatrics.jpg";
import mensImg from "../assets/images/mens.jpeg";
import womensImg from "../assets/images/women.jpeg";
import occupationalImg from "../assets/images/occupational.jpeg";
import geriatricImg from "../assets/images/geriatric.jpeg";

const Departments = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const departments = [
    {
      name: "Family Medicine",
      subtitle: "Comprehensive Care for All Ages",
      description: "Providing complete healthcare services for your entire family with personalized attention and care.",
      features: ["Preventive Care", "Chronic Disease Management", "Health Screenings", "Vaccinations"],
      image: familyImg,
      path: "/family-medicine"
    },
    {
      name: "Pediatric Care",
      subtitle: "Specialized Care for Children",
      description: "Expert healthcare services for children from birth through adolescence, ensuring their healthy development.",
      features: ["Well-Child Visits", "Developmental Monitoring", "Childhood Vaccinations", "Pediatric Emergencies"],
      image: pediatricsImg,
      path: "/pediatric-care"
    },
    {
      name: "Men's Health",
      subtitle: "Comprehensive Men's Healthcare",
      description: "Specialized healthcare services designed specifically for men's unique health needs and concerns.",
      features: ["Preventive Screenings", "Prostate Health", "Sexual Health", "Men's Wellness"],
      image: mensImg,
      path: "/mens-health"
    },
    {
      name: "Women's Health",
      subtitle: "Complete Women's Healthcare",
      description: "Comprehensive healthcare services focusing on women's unique health needs across all life stages.",
      features: ["Gynecological Care", "Breast Health", "Pregnancy Care", "Women's Wellness"],
      image: womensImg,
      path: "/womens-health"
    },
    {
      name: "Occupational Health",
      subtitle: "Workplace Health Services",
      description: "Comprehensive workplace health services focusing on employee wellness and injury prevention.",
      features: ["Pre-employment Physicals", "Workplace Safety", "Injury Management", "Health Screenings"],
      image: occupationalImg,
      path: "/occupational-health"
    },
    {
      name: "Geriatric Care",
      subtitle: "Specialized Senior Care",
      description: "Comprehensive healthcare services tailored to meet the unique needs of older adults.",
      features: ["Senior Health Screenings", "Chronic Disease Management", "Memory Care", "Mobility Support"],
      image: geriatricImg,
      path: "/geriatric-care"
    }
  ];

  const departmentOptions = departments.map(d => d.name);
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ];

  useEffect(() => {
    document.title = "Our Departments — Hope Physicians";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.department) newErrors.department = "Please select a department";
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date";
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = "Please select a future date";
      }
    }
    if (!formData.preferredTime) newErrors.preferredTime = "Please select a preferred time";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Please fill in all required fields correctly", "error");
      return;
    }

    setFormStatus("sending");

    try {
      await submitAppointment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message || ""
      });

      showToast("Appointment request submitted successfully! We will contact you soon.", "success");
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        preferredDate: "",
        preferredTime: "",
        message: ""
      });
      
      setShowModal(false);
      
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Appointment submission error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to submit appointment. Please try again or call us at 252-522-3663.";
      showToast(errorMessage, "error");
    } finally {
      setFormStatus("idle");
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const bookAppointment = (departmentName) => {
    setFormData(prev => ({
      ...prev,
      department: departmentName || ""
    }));
    setShowModal(true);
  };

  return (
    <div className="page">
      {/* PAGE HEADER */}
      <section 
        className="hero-section"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImg})`,
          minHeight: '500px'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '40px', 
            alignItems: 'center',
            minHeight: '500px',
            position: 'relative',
            zIndex: 2
          }}>
            <div className="hero-content">
              <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px', color: '#fff' }}>
                Our Departments
              </h1>
              <p style={{ fontSize: '20px', color: '#fff', margin: 0 }}>
                Comprehensive healthcare services for you and your family
              </p>
            </div>
            <div style={{ 
              width: '300px', 
              height: '300px', 
              margin: '0 auto',
              overflow: 'hidden',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
              <img 
                src={doctorImg} 
                alt="Hospital Departments" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS SECTION */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-8 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Our Departments
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Services We Offer</h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-3xl mx-auto">
              Comprehensive care across every department, delivered with expertise and compassion.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-0 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl flex flex-col overflow-hidden">
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h4 className="text-white text-xl font-bold leading-tight">{dept.name}</h4>
                  <p className="text-blue-100 font-semibold text-sm uppercase tracking-wide">
                    {dept.subtitle}
                  </p>
                  <p className="text-slate-200 text-sm leading-relaxed flex-1">
                    {dept.description}
                  </p>

                  <ul className="space-y-2 text-slate-200 text-sm">
                    {dept.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-[3px] text-blue-200">
                          <i className="fas fa-check-circle"></i>
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-2">
                    <Link
                      className="inline-flex items-center justify-center w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-3 transition shadow-md"
                      to={dept.path}
                      data-discover="true">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING APPOINTMENT BUTTON */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000
      }}>
        <button 
          className="form-btn"
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 30px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '200px',
            justifyContent: 'center',
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          <i className="fas fa-calendar-plus"></i>
          <span>Book Appointment</span>
        </button>
      </div>

      {/* APPOINTMENT MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              background: '#004aad',
              color: '#fff',
              padding: '20px',
              borderRadius: '15px 15px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-calendar-check"></i>
                Book Your Appointment
              </h5>
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {toast.show && (
                <div style={{
                  marginBottom: '20px',
                  padding: '15px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  backgroundColor: toast.type === 'success' ? '#e6ffef' : '#fff0f0',
                  color: toast.type === 'success' ? '#064a2b' : '#7a0f0f'
                }}>
                  {toast.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <span style={{ padding: '10px', background: '#f8f9fa', borderRight: '1px solid #ddd' }}>
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      style={{ flex: 1, padding: '10px', border: 'none', outline: 'none' }}
                    />
                  </div>
                  {errors.name && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.name}</span>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Phone Number
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <span style={{ padding: '10px', background: '#f8f9fa', borderRight: '1px solid #ddd' }}>
                      <i className="fas fa-phone"></i>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      style={{ flex: 1, padding: '10px', border: 'none', outline: 'none' }}
                    />
                  </div>
                  {errors.phone && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.phone}</span>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Email Address
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <span style={{ padding: '10px', background: '#f8f9fa', borderRight: '1px solid #ddd' }}>
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      style={{ flex: 1, padding: '10px', border: 'none', outline: 'none' }}
                    />
                  </div>
                  {errors.email && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Department
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <span style={{ padding: '10px', background: '#f8f9fa', borderRight: '1px solid #ddd' }}>
                      <i className="fas fa-hospital"></i>
                    </span>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      style={{ flex: 1, padding: '10px', border: 'none', outline: 'none', background: '#fff' }}
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  {errors.department && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.department}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Preferred Date
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                      <span style={{ padding: '10px', background: '#f8f9fa', borderRight: '1px solid #ddd' }}>
                        <i className="fas fa-calendar"></i>
                      </span>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={getMinDate()}
                        required
                        style={{ flex: 1, padding: '10px', border: 'none', outline: 'none' }}
                      />
                    </div>
                    {errors.preferredDate && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.preferredDate}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Preferred Time
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                      <span style={{ padding: '10px', background: '#f8f9fa', borderRight: '1px solid #ddd' }}>
                        <i className="fas fa-clock"></i>
                      </span>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        style={{ flex: 1, padding: '10px', border: 'none', outline: 'none', background: '#fff' }}
                      >
                        <option value="">Select Time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    {errors.preferredTime && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.preferredTime}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Additional Notes
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any specific concerns or requirements"
                    rows="3"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="form-btn"
                  disabled={formStatus === "sending"}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    opacity: formStatus === "sending" ? 0.7 : 1,
                    cursor: formStatus === "sending" ? "not-allowed" : "pointer"
                  }}
                >
                  {formStatus === "sending" ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
                      Confirm Appointment
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @media (max-width: 992px) {
          .departments-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .hero-section > .container > div {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          
          .hero-section > .container > div > div:last-child {
            margin-top: 30px;
          }

          .departments-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 576px) {
          .floating-appointment-btn {
            bottom: 20px !important;
            right: 20px !important;
          }
          
          .floating-appointment-btn button {
            padding: 10px 20px !important;
            font-size: 14px !important;
            min-width: 160px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Departments;
