import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { submitAppointment } from '../api/appointmentApi';
import heroImg from "../assets/images/hero2.jpg";
import doctorImg from "../assets/images/doctor.jpg";

const Doctors = () => {
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
    "Family Medicine",
    "Pediatric Care",
    "Men's Health",
    "Women's Health",
    "Occupational Health",
    "Geriatric Care"
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ];

  useEffect(() => {
    document.title = "Our Doctors — Hope Physicians";
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
      
      // Show error message with better handling for 502 errors
      let errorMessage;
      if (err.status === 502 || err.isGatewayError) {
        errorMessage =
          "The server is temporarily unavailable. Please try again in a few moments or call us at 252-522-3663.";
      } else if (err.isConnectionError) {
        errorMessage = err.message || "Unable to connect to the server. Please check your internet connection and try again.";
      } else {
        errorMessage = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.message || 
                      "Failed to submit appointment. Please try again or call us at 252-522-3663.";
      }
      showToast(errorMessage, "error");
    } finally {
      setFormStatus("idle");
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const bookAppointment = (doctorName, department) => {
    setFormData(prev => ({
      ...prev,
      department: department || ""
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
                Our Medical Team
              </h1>
              <p style={{ fontSize: '20px', color: '#fff', margin: 0 }}>
                Meet our experienced doctor dedicated to your health
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
                alt="Dr. Okonkwo" 
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

      {/* DOCTORS SECTION */}
      <section className="section" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="service-card" style={{
              background: '#fff',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ 
                width: '100%', 
                height: '400px', 
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={doctorImg} 
                  alt="Dr. Okonkwo"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
              <div style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '15px', fontSize: '32px', fontWeight: '700' }}>
                  Dr. Okonkwo
                </h2>
                <p style={{ color: '#004aad', fontWeight: '600', marginBottom: '15px', fontSize: '18px' }}>
                  Lead Physician - Family Medicine
                </p>
                <p style={{ marginBottom: '30px', fontSize: '16px', color: '#666' }}>
                  MBBS, MD - Family Medicine | 15+ Years Experience
                </p>

                <div>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '30px', color: '#333' }}>
                    Dr. Okonkwo is a highly experienced family physician with a passion for providing comprehensive healthcare to patients of all ages. His expertise includes:
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-check-circle" style={{ color: '#004aad', marginRight: '10px' }}></i>
                      Comprehensive Family Healthcare
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-check-circle" style={{ color: '#004aad', marginRight: '10px' }}></i>
                      Preventive Medicine & Wellness
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-check-circle" style={{ color: '#004aad', marginRight: '10px' }}></i>
                      Chronic Disease Management
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-check-circle" style={{ color: '#004aad', marginRight: '10px' }}></i>
                      Patient Education & Counseling
                    </li>
                  </ul>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '15px', 
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <Link 
                      to="/appointment"
                      className="cta-primary-btn inline-flex items-center justify-center px-5 py-3 rounded-full font-semibold transition duration-200"
                    >
                      <span>Book Appointment</span>
                      <span className="cta-arrow ml-2">→</span>
                    </Link>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <a 
                        href="#" 
                        className="icon-btn"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fab fa-linkedin"></i>
                      </a>
                      <a 
                        href="mailto:doctor@hopephysicians.com" 
                        className="icon-btn"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fas fa-envelope"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        <Link 
          to="/appointment"
          className="form-btn"
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
            animation: 'float 3s ease-in-out infinite',
            textDecoration: 'none'
          }}
        >
          <i className="fas fa-calendar-plus"></i>
          <span>Book Appointment</span>
        </Link>
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
                      {departments.map(dept => (
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

        @media (max-width: 768px) {
          .hero-section > .container > div {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          
          .hero-section > .container > div > div:last-child {
            margin-top: 30px;
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

export default Doctors;
