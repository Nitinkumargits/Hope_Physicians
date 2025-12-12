import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaUserMd,
  FaUserShield,
  FaUsers,
  FaEnvelope,
  FaLock,
  FaMobileAlt,
} from "react-icons/fa";
import "../styles/Home.css";
import "../styles/Portal.css";
import Input from "../components/shared/Input";
import Button from "../components/shared/Button";
import Modal from "../components/shared/Modal";
import toast from "react-hot-toast";

const Portal = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("credentials");
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeSection, setActiveSection] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    document.title = "Patient Portal — Hope Physicians";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (loginMethod === "credentials") {
      if (!formData.email.trim()) {
        newErrors.email = "Email or username is required.";
      }
      if (!formData.password.trim()) {
        newErrors.password =
          "Password cannot be blank. Please enter a valid password.";
      }
    } else {
      if (!formData.phone.trim()) {
        newErrors.phone = "Please enter phone number.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrors({}); // Clear previous errors

      try {
        const email = formData.email || formData.username;
        const result = await login(email, formData.password, selectedRole);

        if (!result.success) {
          setErrors({
            general:
              result.error || "Login failed. Please check your credentials.",
          });
        }
        // If successful, AuthContext will handle navigation
      } catch (error) {
        setErrors({
          general: error.message || "Login failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle action click
  const handleActionClick = (actionId) => {
    setActiveSection(actionId);

    // If user is logged in, navigate directly to the relevant page
    if (user) {
      switch (actionId) {
        case "login":
          // If already logged in, redirect to dashboard based on role
          if (user.role === "patient") {
            navigate("/patient");
          } else if (user.role === "doctor") {
            navigate("/doctor");
          } else if (user.role === "admin") {
            navigate("/admin");
          } else if (user.role === "staff") {
            navigate("/staff");
          }
          break;
        case "appointment":
          if (user.role === "patient") {
            navigate("/patient/appointments/book");
          } else {
            navigate("/appointment");
          }
          break;
        case "televisit":
          // Navigate to televisit page or show message
          if (user.role === "patient") {
            navigate("/patient/appointments");
          } else {
            toast.error("Televisit feature coming soon!");
          }
          break;
        case "paybill":
          if (user.role === "patient") {
            navigate("/patient/billing");
          } else {
            toast.error("Billing access is only available for patients.");
          }
          break;
        default:
          break;
      }
    } else {
      // If not logged in, show login form for login action
      if (actionId === "login") {
        // Already handled by activeSection state
        return;
      } else {
        // For other actions, show custom login prompt modal
        setPendingAction(actionId);
        setShowLoginPrompt(true);
      }
    }
  };

  // Handle login prompt confirmation
  const handleLoginPromptConfirm = () => {
    setShowLoginPrompt(false);
    setActiveSection("login");
    setPendingAction(null);
  };

  // Handle login prompt cancel
  const handleLoginPromptCancel = () => {
    setShowLoginPrompt(false);
    setPendingAction(null);
  };

  const portalActions = [
    {
      id: "login",
      icon: "📋",
      title: user ? "Go to Dashboard" : "Login To Patient Portal",
      description: user
        ? `Access your ${user.role} dashboard`
        : "Access your health record",
      color: "#4A90E2",
      path: user
        ? user.role === "patient"
          ? "/patient"
          : user.role === "doctor"
          ? "/doctor"
          : user.role === "admin"
          ? "/admin"
          : "/staff"
        : null,
    },
    {
      id: "appointment",
      icon: "📅",
      title: "Book an appointment",
      description: "Connect with a doctor in minutes",
      color: "#9B59B6",
      path:
        user && user.role === "patient"
          ? "/patient/appointments/book"
          : "/appointment",
    },
    {
      id: "televisit",
      icon: "💻",
      title: "Join a Televisit",
      description: "Join a booked consultation",
      color: "#E91E63",
      path: user && user.role === "patient" ? "/patient/appointments" : null,
    },
    {
      id: "paybill",
      icon: "💳",
      title: "Pay your bill",
      description: "View and settle your statements",
      color: "#E74C3C",
      path: user && user.role === "patient" ? "/patient/billing" : null,
    },
  ];

  return (
    <div className="portal-page">
      {/* Background decorative elements */}
      <div className="portal-bg-decoration">
        <div className="wave-shape wave-top-right"></div>
        <div className="wave-shape wave-bottom-right"></div>
      </div>

      <div className="container portal-container">
        {/* Header Section */}
        <div className="portal-header">
          <h1 className="portal-title">Welcome to Your Family Doctor</h1>
          <p className="portal-description">
            The HealthCare Support Portal connects you to all clinics in the
            Hope Physicians Network, including our main clinic and satellite
            locations, with 24x7 access from home or office.
          </p>
        </div>

        {/* Main Portal Card */}
        <div className="portal-main-card">
          {/* Left Panel - Navigation Actions */}
          <div className="portal-actions-panel">
            {portalActions.map((action) => {
              const isActive = activeSection === action.id;
              const canNavigate = user && action.path;

              return (
                <div
                  key={action.id}
                  className={`portal-action-item ${isActive ? "active" : ""} ${
                    canNavigate ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleActionClick(action.id)}
                  style={{
                    backgroundColor: isActive ? "#E8F4FD" : "transparent",
                    borderColor: isActive ? "#4A90E2" : "transparent",
                    cursor: canNavigate ? "pointer" : "default",
                  }}>
                  <div className="action-icon">
                    <span style={{ fontSize: "24px" }}>{action.icon}</span>
                  </div>
                  <div className="action-content">
                    <h3
                      className="action-title"
                      style={{
                        color: isActive ? "#004aad" : "#333",
                      }}>
                      {action.title}
                    </h3>
                    <p className="action-description">{action.description}</p>
                  </div>
                  <div className="action-arrow">
                    <span
                      style={{
                        color: isActive ? "#004aad" : "#666",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}>
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel - Login Form */}
          <div className="portal-login-panel">
            <div className="login-panel-header">
              <h2 className="login-panel-title">
                {selectedRole
                  ? `Login to ${
                      selectedRole === "doctor"
                        ? "Doctor"
                        : selectedRole === "patient"
                        ? "Patient"
                        : selectedRole === "staff"
                        ? "Staff"
                        : selectedRole === "admin"
                        ? "Admin"
                        : "Portal"
                    } Portal`
                  : "Login to Portal"}
              </h2>
              <p className="login-panel-subtitle">
                {selectedRole
                  ? `Enter your ${selectedRole} credentials to access your account`
                  : "Enter your credentials to access your account"}
              </p>
            </div>

            {/* Role Selection */}
            {!selectedRole && (
              <div className="mb-6">
                <label className="block text-base font-bold text-gray-900 mb-5 text-left">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      role: "patient",
                      Icon: FaUser,
                      label: "Patient",
                      bgGradient: "from-blue-50 to-blue-100/50",
                      borderColor: "border-blue-400",
                      textColor: "text-blue-900",
                      iconColor: "text-blue-600",
                      hoverBg: "hover:from-blue-100 hover:to-blue-200/50",
                      hoverBorder: "hover:border-blue-600",
                      hoverShadow: "hover:shadow-xl hover:shadow-blue-300/40",
                      iconBg: "bg-blue-100",
                    },
                    {
                      role: "doctor",
                      Icon: FaUserMd,
                      label: "Doctor",
                      bgGradient: "from-emerald-50 to-emerald-100/50",
                      borderColor: "border-emerald-400",
                      textColor: "text-emerald-900",
                      iconColor: "text-emerald-600",
                      hoverBg: "hover:from-emerald-100 hover:to-emerald-200/50",
                      hoverBorder: "hover:border-emerald-600",
                      hoverShadow:
                        "hover:shadow-xl hover:shadow-emerald-300/40",
                      iconBg: "bg-emerald-100",
                    },
                    {
                      role: "admin",
                      Icon: FaUserShield,
                      label: "Admin",
                      bgGradient: "from-violet-50 to-violet-100/50",
                      borderColor: "border-violet-400",
                      textColor: "text-violet-900",
                      iconColor: "text-violet-600",
                      hoverBg: "hover:from-violet-100 hover:to-violet-200/50",
                      hoverBorder: "hover:border-violet-600",
                      hoverShadow: "hover:shadow-xl hover:shadow-violet-300/40",
                      iconBg: "bg-violet-100",
                    },
                    {
                      role: "staff",
                      Icon: FaUsers,
                      label: "Staff",
                      bgGradient: "from-amber-50 to-amber-100/50",
                      borderColor: "border-amber-400",
                      textColor: "text-amber-900",
                      iconColor: "text-amber-600",
                      hoverBg: "hover:from-amber-100 hover:to-amber-200/50",
                      hoverBorder: "hover:border-amber-600",
                      hoverShadow: "hover:shadow-xl hover:shadow-amber-300/40",
                      iconBg: "bg-amber-100",
                    },
                  ].map((item) => {
                    const IconComponent = item.Icon;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setSelectedRole(item.role)}
                        className={`
                          group relative p-6 border-2 rounded-2xl transition-all duration-300 ease-in-out
                          font-semibold flex flex-col items-center justify-center gap-3
                          bg-gradient-to-br ${item.bgGradient}
                          ${item.borderColor} ${item.textColor}
                          ${item.hoverBg} ${item.hoverBorder} ${item.hoverShadow}
                          hover:scale-[1.04] hover:-translate-y-2
                          active:scale-[0.98] active:translate-y-0
                          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary/30
                          min-h-[130px] w-full
                          cursor-pointer overflow-hidden
                        `}>
                        {/* Background decoration */}
                        <div
                          className={`absolute top-0 right-0 w-20 h-20 ${item.iconBg} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                        <div
                          className={`absolute bottom-0 left-0 w-16 h-16 ${item.iconBg} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>

                        {/* Icon container */}
                        <div
                          className={`
                          relative z-10 p-4 rounded-2xl ${item.iconBg} 
                          group-hover:scale-110 group-hover:rotate-3
                          transition-all duration-300 ease-in-out
                          shadow-md group-hover:shadow-lg
                        `}>
                          <IconComponent
                            className={`text-4xl ${item.iconColor} transition-colors duration-300`}
                          />
                        </div>

                        {/* Label */}
                        <span className="relative z-10 text-sm font-bold tracking-wider uppercase">
                          {item.label}
                        </span>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-all duration-300"></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedRole && (
              <>
                <div className="mb-6" style={{ marginBottom: "20px" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#004aad",
                      background: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 74, 173, 0.05)";
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.textDecoration = "none";
                    }}>
                    {/* Icon */}
                    <svg
                      style={{
                        width: "12px",
                        height: "12px",
                        color: "#004aad",
                        transition: "transform 0.15s ease",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>

                    {/* Text */}
                    <span style={{ color: "#004aad" }}>Change Role</span>
                  </button>
                </div>

                {/* Login Method Selection */}
                <div className="login-method-selector">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="loginMethod"
                      value="credentials"
                      checked={loginMethod === "credentials"}
                      onChange={(e) => setLoginMethod(e.target.value)}
                    />
                    <span>User Credentials</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="loginMethod"
                      value="mobile"
                      checked={loginMethod === "mobile"}
                      onChange={(e) => setLoginMethod(e.target.value)}
                    />
                    <span>Using Mobile Phone</span>
                  </label>
                </div>
              </>
            )}

            {/* Login Form */}
            {selectedRole && (
              <form onSubmit={handleSubmit} className="portal-login-form">
                {loginMethod === "credentials" ? (
                  <>
                    <div className="form-input-wrapper">
                      <span className="input-icon">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email or Username"
                        className={errors.email ? "error" : ""}
                        autoComplete="username"
                        required
                      />
                    </div>
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}

                    <div className="form-input-wrapper">
                      <span className="input-icon">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={errors.password ? "error" : ""}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="form-input-wrapper">
                      <span className="input-icon">
                        <FaMobileAlt />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className={errors.phone ? "error" : ""}
                        autoComplete="tel"
                        required
                      />
                    </div>
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </>
                )}

                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      {errors.general}
                    </p>
                  </div>
                )}

                <div className="login-form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={loading}
                    disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  <a
                    href="#"
                    className="trouble-login-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info(
                        "Please contact support at 252-522-3663 for login assistance.",
                        {
                          duration: 5000,
                        }
                      );
                    }}>
                    Trouble logging in?
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      <Modal
        isOpen={showLoginPrompt}
        onClose={handleLoginPromptCancel}
        title="Login Required"
        size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaEnvelope className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                Please login first to access this feature. Would you like to
                login now?
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleLoginPromptCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLoginPromptConfirm}>
              Login Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Portal;
