import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHospital,
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaInfoCircle,
  FaSpinner,
  FaHeartbeat,
  FaBaby,
  FaMale,
  FaFemale,
  FaBriefcase,
  FaUserMd,
  FaExclamationTriangle,
  FaCalendarWeek,
} from "react-icons/fa";
import "../styles/Home.css";
import "../styles/Forms.css";
import { submitAppointment } from "../api/appointmentApi";

const Appointment = () => {
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Departments with icons and descriptions
  const departments = [
    {
      name: "Family Medicine",
      icon: FaStethoscope,
      description: "Comprehensive healthcare for all ages",
    },
    {
      name: "Pediatric Care",
      icon: FaBaby,
      description: "Specialized care for infants and children",
    },
    {
      name: "Men's Health",
      icon: FaMale,
      description: "Focused healthcare solutions for men",
    },
    {
      name: "Women's Health",
      icon: FaFemale,
      description: "Comprehensive women's healthcare services",
    },
    {
      name: "Occupational Health",
      icon: FaBriefcase,
      description: "Workplace health and wellness programs",
    },
    {
      name: "Geriatric Care",
      icon: FaUserMd,
      description: "Specialized care for senior patients",
    },
  ];

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  useEffect(() => {
    document.title = "Book Appointment — Hope Physicians";
    // Scroll to top immediately when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date";
    } else {
      // Check if date is in the past
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = "Please select a future date";
      }
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select a preferred time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setSelectedDepartment(value);
    handleChange(e);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
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
        message: formData.message || "",
      });

      // Success
      toast.success(
        "Appointment request submitted successfully! We will contact you soon to confirm.",
        {
          duration: 5000,
          icon: "✅",
        }
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
      setSelectedDepartment("");

      // Optionally redirect after a delay
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
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to submit appointment. Please try again or call us at 252-522-3663.";
      }

      toast.error(errorMessage, {
        duration: 7000, // Longer duration for error messages
      });
    } finally {
      setFormStatus("idle");
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="page">
      {/* SIMPLE HERO SECTION (NO BACKGROUND IMAGE) */}
      <section
        className="section"
        style={{ background: "#f6f8fb", padding: "40px 0 10px" }}>
        <div
          className="container"
          style={{
            textAlign: "center",
            maxWidth: "700px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(0, 74, 173, 0.06)",
              border: "1px solid rgba(0, 74, 173, 0.18)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#004aad",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "999px",
                background: "#22c55e",
              }}
            />
            <span>Trusted Care at Hope Physicians</span>
          </div>

          <h1
            className="section-title"
            style={{
              fontSize: "32px",
              marginBottom: "4px",
              marginTop: "4px",
              color: "#004aad",
              letterSpacing: "-0.02em",
            }}>
            Book an Appointment
          </h1>

          <p
            className="subheading"
            style={{
              fontSize: "16px",
              color: "#4b5563",
              margin: 0,
              lineHeight: 1.6,
            }}>
            Schedule your visit with our healthcare professionals and get the
            care you need, at a time that works for you.
          </p>
        </div>
      </section>

      {/* APPOINTMENT FORM SECTION */}
      <section
        className="section"
        id="appointment-form"
        style={{ background: "#f6f8fb" }}>
        <div className="container">
          <div
            className="appointment-box"
            style={{
              maxWidth: "750px",
              margin: "0 auto",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "32px 28px 30px",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
              border: "1px solid rgba(0, 74, 173, 0.12)",
            }}>
            <div style={{ textAlign: "center", marginBottom: "35px" }}>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  margin: "0 auto 20px",
                  background:
                    "linear-gradient(135deg, #004aad 0%, #003784 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(0, 74, 173, 0.3)",
                }}>
                <FaCalendarAlt style={{ fontSize: "32px", color: "white" }} />
              </div>
              <h2
                className="section-title"
                style={{
                  textAlign: "center",
                  marginBottom: "12px",
                  color: "#004aad",
                  fontSize: "32px",
                }}>
                Schedule Your Appointment
              </h2>
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "0",
                  color: "#666",
                  fontSize: "16px",
                  lineHeight: "1.6",
                }}>
                Please fill out the form below and we'll contact you to confirm
                your appointment time.
              </p>
            </div>

            <form
              id="appointmentForm"
              className="appointment-form"
              onSubmit={handleSubmit}
              aria-live="polite"
              noValidate>
              {/* Section: Patient Details */}
              <div
                style={{
                  marginBottom: "12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6b7280",
                }}>
                Patient Details
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor="name"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <FaUser style={{ color: "#004aad", fontSize: "16px" }} />
                    Your Name *
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaUser
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: errors.name ? "#d32f2f" : "#999",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      style={{
                        paddingLeft: "45px",
                        borderColor: errors.name ? "#d32f2f" : "#dcdcdc",
                      }}
                    />
                  </div>
                  {errors.name && (
                    <span
                      id="name-error"
                      className="error-message"
                      style={{
                        color: "#d32f2f",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}>
                      <FaInfoCircle /> {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="email"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <FaEnvelope
                      style={{ color: "#004aad", fontSize: "16px" }}
                    />
                    Email Address *
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaEnvelope
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: errors.email ? "#d32f2f" : "#999",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      style={{
                        paddingLeft: "45px",
                        borderColor: errors.email ? "#d32f2f" : "#dcdcdc",
                      }}
                    />
                  </div>
                  {errors.email && (
                    <span
                      id="email-error"
                      className="error-message"
                      style={{
                        color: "#d32f2f",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}>
                      <FaInfoCircle /> {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Section: Appointment Preferences */}
              <div
                style={{
                  margin: "24px 0 12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6b7280",
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "16px",
                }}>
                Appointment Preferences
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor="phone"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <FaPhone style={{ color: "#004aad", fontSize: "16px" }} />
                    Phone Number *
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaPhone
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: errors.phone ? "#d32f2f" : "#999",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(252) 522-3663"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      style={{
                        paddingLeft: "45px",
                        borderColor: errors.phone ? "#d32f2f" : "#dcdcdc",
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <span
                      id="phone-error"
                      className="error-message"
                      style={{
                        color: "#d32f2f",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}>
                      <FaInfoCircle /> {errors.phone}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="department"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <FaHospital
                      style={{ color: "#004aad", fontSize: "16px" }}
                    />
                    Select Department *
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaHospital
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: errors.department ? "#d32f2f" : "#999",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleDepartmentChange}
                      required
                      aria-invalid={errors.department ? "true" : "false"}
                      aria-describedby={
                        errors.department ? "department-error" : undefined
                      }
                      style={{
                        paddingLeft: "45px",
                        borderColor: errors.department ? "#d32f2f" : "#dcdcdc",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 15px center",
                        paddingRight: "40px",
                      }}>
                      <option value="">Choose a department</option>
                      {departments.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedDepartment && (
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "10px",
                        background: "#e0f2fe",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#0369a1",
                      }}>
                      <strong>
                        {
                          departments.find((d) => d.name === selectedDepartment)
                            ?.name
                        }
                        :
                      </strong>{" "}
                      {
                        departments.find((d) => d.name === selectedDepartment)
                          ?.description
                      }
                    </div>
                  )}
                  {errors.department && (
                    <span
                      id="department-error"
                      className="error-message"
                      style={{
                        color: "#d32f2f",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}>
                      <FaInfoCircle /> {errors.department}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor="preferredDate"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <FaCalendarAlt
                      style={{ color: "#004aad", fontSize: "16px" }}
                    />
                    Preferred Date *
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaCalendarAlt
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: errors.preferredDate ? "#d32f2f" : "#999",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={getMinDate()}
                      required
                      aria-invalid={errors.preferredDate ? "true" : "false"}
                      aria-describedby={
                        errors.preferredDate ? "date-error" : undefined
                      }
                      style={{
                        paddingLeft: "45px",
                        borderColor: errors.preferredDate
                          ? "#d32f2f"
                          : "#dcdcdc",
                      }}
                    />
                  </div>
                  {errors.preferredDate && (
                    <span
                      id="date-error"
                      className="error-message"
                      style={{
                        color: "#d32f2f",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}>
                      <FaInfoCircle /> {errors.preferredDate}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="preferredTime"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <FaClock style={{ color: "#004aad", fontSize: "16px" }} />
                    Preferred Time *
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaClock
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: errors.preferredTime ? "#d32f2f" : "#999",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    />
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.preferredTime ? "true" : "false"}
                      aria-describedby={
                        errors.preferredTime ? "time-error" : undefined
                      }
                      style={{
                        paddingLeft: "45px",
                        borderColor: errors.preferredTime
                          ? "#d32f2f"
                          : "#dcdcdc",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 15px center",
                        paddingRight: "40px",
                      }}>
                      <option value="">Select Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.preferredTime && (
                    <span
                      id="time-error"
                      className="error-message"
                      style={{
                        color: "#d32f2f",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}>
                      <FaInfoCircle /> {errors.preferredTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write any details you want us to know..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="form-btn"
                  disabled={formStatus === "sending"}
                  style={{
                    opacity: formStatus === "sending" ? 0.7 : 1,
                    cursor:
                      formStatus === "sending" ? "not-allowed" : "pointer",
                    width: "100%",
                    padding: "15px",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background:
                      formStatus === "sending"
                        ? "#6b7280"
                        : "linear-gradient(135deg, #004aad 0%, #003784 100%)",
                    transition: "all 0.3s ease",
                  }}>
                  {formStatus === "sending" ? (
                    <>
                      <FaSpinner
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Submit Appointment Request
                    </>
                  )}
                </button>
              </div>

              <p
                style={{
                  marginTop: "20px",
                  fontSize: "13px",
                  color: "#666",
                  textAlign: "center",
                  lineHeight: "1.6",
                }}>
                By submitting this form, you agree to be contacted by Hope
                Physicians regarding your appointment request. We will call or
                email you to confirm your appointment time.
              </p>
            </form>
          </div>

          {/* Helpful Info Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "50px",
              marginBottom: "40px",
            }}>
            <div
              style={{
                background: "linear-gradient(135deg, #004aad 0%, #003784 100%)",
                color: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0, 74, 173, 0.2)",
              }}>
              <FaClock style={{ fontSize: "28px", marginBottom: "10px" }} />
              <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                Quick Response
              </h3>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
                We'll contact you within 24 hours to confirm your appointment
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)",
              }}>
              <FaCheckCircle
                style={{ fontSize: "28px", marginBottom: "10px" }}
              />
              <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                Easy Booking
              </h3>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
                Simple form takes less than 2 minutes to complete
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.2)",
              }}>
              <FaHeartbeat style={{ fontSize: "28px", marginBottom: "10px" }} />
              <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                Expert Care
              </h3>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
                Board-certified physicians ready to serve you
              </p>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div
            style={{
              marginTop: "50px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "25px",
            }}>
            {/* Phone Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #004aad 0%, #003784 100%)",
                color: "white",
                padding: "35px 30px",
                borderRadius: "20px",
                boxShadow: "0 8px 25px rgba(0, 74, 173, 0.25)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 35px rgba(0, 74, 173, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0, 74, 173, 0.25)";
              }}>
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "150px",
                  height: "150px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  filter: "blur(30px)",
                }}
              />
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  margin: "0 auto 20px",
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}>
                <FaPhone style={{ fontSize: "32px" }} />
              </div>
              <h3
                style={{
                  marginBottom: "12px",
                  fontSize: "22px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}>
                Prefer to Call?
              </h3>
              <a
                href="tel:2525223663"
                style={{
                  display: "inline-block",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "white",
                  textDecoration: "none",
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  marginTop: "10px",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.transform = "scale(1)";
                }}>
                252-522-3663
              </a>
            </div>

            {/* Office Hours Card */}
            <div
              style={{
                background: "white",
                padding: "35px 30px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "2px solid #e0f2fe",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(0, 0, 0, 0.12)";
                e.currentTarget.style.borderColor = "#bae6fd";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.borderColor = "#e0f2fe";
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  paddingBottom: "20px",
                  borderBottom: "2px solid #f0f9ff",
                }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.25)",
                  }}>
                  <FaCalendarWeek
                    style={{ fontSize: "24px", color: "white" }}
                  />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    color: "#004aad",
                    fontWeight: "600",
                  }}>
                  Office Hours
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    background: "#f0f9ff",
                    borderRadius: "8px",
                  }}>
                  <FaCalendarAlt
                    style={{ color: "#0369a1", fontSize: "18px" }}
                  />
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#0369a1",
                        fontWeight: "600",
                      }}>
                      Monday - Thursday
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "14px",
                        color: "#666",
                      }}>
                      8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    background: "#f0f9ff",
                    borderRadius: "8px",
                  }}>
                  <FaCalendarAlt
                    style={{ color: "#0369a1", fontSize: "18px" }}
                  />
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#0369a1",
                        fontWeight: "600",
                      }}>
                      Friday
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "14px",
                        color: "#666",
                      }}>
                      8:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                padding: "35px 30px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(220, 38, 38, 0.15)",
                border: "2px solid #fca5a5",
                textAlign: "center",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(220, 38, 38, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(220, 38, 38, 0.15)";
              }}>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  margin: "0 auto 20px",
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
                  animation: "pulse 2s infinite",
                }}>
                <FaExclamationTriangle
                  style={{ fontSize: "32px", color: "white" }}
                />
              </div>
              <h3
                style={{
                  marginBottom: "12px",
                  fontSize: "20px",
                  color: "#991b1b",
                  fontWeight: "700",
                }}>
                Emergency?
              </h3>
              <a
                href="tel:911"
                style={{
                  display: "inline-block",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#dc2626",
                  textDecoration: "none",
                  padding: "12px 24px",
                  background: "white",
                  borderRadius: "12px",
                  marginTop: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 10px rgba(220, 38, 38, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#dc2626";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#dc2626";
                  e.currentTarget.style.transform = "scale(1)";
                }}>
                Call 911
              </a>
              <p
                style={{
                  margin: "15px 0 0 0",
                  fontSize: "13px",
                  color: "#991b1b",
                  fontWeight: "500",
                  lineHeight: "1.5",
                }}>
                For life-threatening emergencies, call 911 immediately
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
          }
        }

        .form-group input:invalid:not(:placeholder-shown),
        .form-group select:invalid:not(:placeholder-shown) {
          border-color: #d32f2f;
        }

        .form-group input:valid:not(:placeholder-shown),
        .form-group select:valid:not(:placeholder-shown) {
          border-color: #4caf50;
        }

        .form-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 74, 173, 0.4);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #004aad;
          box-shadow: 0 0 0 3px rgba(0, 74, 173, 0.1);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Appointment;
