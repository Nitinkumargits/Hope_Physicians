import { useState, useRef, useEffect } from "react";
import { submitAppointment } from "../api/appointmentApi";
import "../styles/Home.css";

export default function AppointmentForm() {
  const [formStatus, setFormStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const formRef = useRef(null);

  // Departments matching actual services
  const departments = [
    "Family Medicine",
    "Pediatric Care",
    "Men's Health",
    "Women's Health",
    "Occupational Health",
    "Geriatric Care",
  ];

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
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
        message: formData.message || "",
      });

      // Success
      showToast(
        "Appointment request submitted successfully! We will contact you soon.",
        "success"
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        message: "",
      });

      if (formRef.current) {
        formRef.current.reset();
      }
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
      showToast(errorMessage, "error");
    } finally {
      setFormStatus("idle");
    }
  };

  // Scroll to form on mount if there's a hash
  useEffect(() => {
    if (window.location.hash === "#appointment-form") {
      const formElement = document.getElementById("appointment-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  return (
    <section
      className="section appointment"
      id="appointment-form"
      aria-labelledby="appointment-heading">
      <div className="container appointment-box reveal-on-scroll">
        <h2 id="appointment-heading" className="section-title">
          Book an Appointment
        </h2>

        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`form-toast ${toast.type}`}
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "8px",
              fontWeight: "600",
              animation: "fadeIn 0.3s ease",
            }}
            role="alert">
            {toast.message}
          </div>
        )}

        <form
          id="appointmentForm"
          className="appointment-form"
          onSubmit={handleSubmit}
          ref={formRef}
          aria-live="polite"
          noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
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
              />
              {errors.name && (
                <span
                  id="name-error"
                  className="error-message"
                  style={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}>
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span
                  id="email-error"
                  className="error-message"
                  style={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(252) 522-3663"
                value={formData.phone}
                onChange={handleChange}
                required
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <span
                  id="phone-error"
                  className="error-message"
                  style={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}>
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="department">Select Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                aria-invalid={errors.department ? "true" : "false"}
                aria-describedby={
                  errors.department ? "department-error" : undefined
                }>
                <option value="">Choose a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span
                  id="department-error"
                  className="error-message"
                  style={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}>
                  {errors.department}
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
                cursor: formStatus === "sending" ? "not-allowed" : "pointer",
              }}>
              {formStatus === "sending" ? (
                <>
                  <span style={{ marginRight: "8px" }}>⏳</span>
                  Sending...
                </>
              ) : (
                "Submit Appointment"
              )}
            </button>
          </div>

          <p
            style={{
              marginTop: "15px",
              fontSize: "13px",
              color: "#666",
              textAlign: "center",
            }}>
            By submitting this form, you agree to be contacted by Hope
            Physicians regarding your appointment request.
          </p>
        </form>
      </div>

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
          box-shadow: 0 4px 12px rgba(0, 74, 173, 0.3);
        }
      `}</style>
    </section>
  );
}
