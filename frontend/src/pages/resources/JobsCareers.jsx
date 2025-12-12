import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
import "../../styles/Forms.css";
import heroImg from "../../assets/images/hero2.jpg";

const JobsCareers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    jobTitle: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
  });

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

  const jobOpenings = [
    {
      id: 1,
      title: "Family Medicine Physician",
      department: "Family Medicine",
      type: "Full-time",
      location: "Kinston, NC",
      description:
        "We are seeking a board-certified Family Medicine Physician to join our team. The ideal candidate will provide comprehensive primary care services to patients of all ages.",
      requirements: [
        "MD or DO degree from accredited medical school",
        "Board certification in Family Medicine",
        "Active North Carolina medical license",
        "DEA registration",
        "Minimum 2 years of clinical experience preferred",
        "Strong communication and interpersonal skills",
      ],
      benefits: [
        "Competitive salary and benefits package",
        "Malpractice insurance coverage",
        "CME allowance",
        "Paid time off and holidays",
        "Health, dental, and vision insurance",
        "401(k) retirement plan",
      ],
      postedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Registered Nurse (RN)",
      department: "Clinical Services",
      type: "Full-time",
      location: "Kinston, NC",
      description:
        "Seeking an experienced Registered Nurse to provide patient care and support our clinical team. Must be able to work in a fast-paced environment.",
      requirements: [
        "Current RN license in North Carolina",
        "BLS certification required",
        "Minimum 1 year of nursing experience",
        "Excellent clinical skills",
        "Ability to work flexible hours",
      ],
      benefits: [
        "Competitive hourly wage",
        "Health insurance",
        "Paid time off",
        "Shift differential pay",
        "Professional development opportunities",
      ],
      postedDate: "2024-01-20",
    },
    {
      id: 3,
      title: "Medical Assistant",
      department: "Clinical Services",
      type: "Full-time",
      location: "Kinston, NC",
      description:
        "Join our team as a Medical Assistant. You will assist physicians with patient care, perform basic clinical tasks, and ensure smooth clinic operations.",
      requirements: [
        "Medical Assistant certification (CMA or RMA)",
        "High school diploma or equivalent",
        "Basic computer skills",
        "Excellent customer service skills",
        "Ability to multitask",
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Paid time off",
        "On-the-job training",
        "Career advancement opportunities",
      ],
      postedDate: "2024-01-25",
    },
    {
      id: 4,
      title: "Front Office Receptionist",
      department: "Administration",
      type: "Full-time",
      location: "Kinston, NC",
      description:
        "We are looking for a friendly and organized Front Office Receptionist to greet patients, schedule appointments, and handle administrative tasks.",
      requirements: [
        "High school diploma or equivalent",
        "Previous medical office experience preferred",
        "Excellent communication skills",
        "Proficiency in Microsoft Office",
        "Strong organizational skills",
      ],
      benefits: [
        "Competitive hourly wage",
        "Health insurance",
        "Paid time off",
        "Monday-Friday schedule",
        "Friendly work environment",
      ],
      postedDate: "2024-02-01",
    },
    {
      id: 5,
      title: "Billing Specialist",
      department: "Billing",
      type: "Full-time",
      location: "Kinston, NC",
      description:
        "Seeking an experienced Billing Specialist to handle insurance claims, patient billing, and accounts receivable management.",
      requirements: [
        "High school diploma or equivalent",
        "2+ years of medical billing experience",
        "Knowledge of insurance claims processing",
        "Proficiency in medical billing software",
        "Attention to detail",
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Paid time off",
        "Remote work options available",
        "Professional development",
      ],
      postedDate: "2024-02-05",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setApplicationForm({ ...applicationForm, resume: files[0] });
    } else {
      setApplicationForm({ ...applicationForm, [name]: value });
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setApplicationForm({ ...applicationForm, jobTitle: job.title });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank you for your application for ${applicationForm.jobTitle}. We will review your application and contact you soon.`
    );
    setApplicationForm({
      jobTitle: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      resume: null,
      coverLetter: "",
    });
    setSelectedJob(null);
  };

  return (
    <>
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
                  Jobs and Careers at Hope Physicians
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 reveal-on-scroll leading-relaxed">
                  Join our team and make a difference in healthcare. We're
                  committed to providing excellent patient care and supporting
                  our team members with competitive benefits and professional
                  development opportunities.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 reveal-on-scroll">
                  <span>Contact HR Department</span>
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
                Build Your Career With Us
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                At Hope Physicians, we value our team members and provide a
                supportive work environment with opportunities for growth,
                competitive compensation, and comprehensive benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                Why Choose Us
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Why Work at Hope Physicians?
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              We're committed to providing excellent patient care and supporting
              our team members
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4 text-primary">
                <i className="fas fa-hospital"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Excellent Benefits
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive health insurance, retirement plans, and paid time
                off for all full-time employees.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4 text-primary">
                <i className="fas fa-book"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Professional Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ongoing training opportunities and support for continuing
                education and career growth.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4 text-primary">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Supportive Environment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Work with a collaborative team dedicated to providing
                compassionate patient care.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4 text-primary">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Work-Life Balance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Flexible scheduling options and competitive compensation
                packages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT OPENINGS */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                Open Positions
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Current Job Openings
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Explore our available positions and find your next career
              opportunity
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleJobSelect(job)}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {job.department} • {job.type} • {job.location}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {job.description}
                </p>
                <button className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center gap-2">
                  View Details & Apply
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
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOB APPLICATION FORM */}
      {selectedJob && (
        <section className="relative py-20 md:py-28 reveal-on-scroll bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                    Apply Now
                  </p>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Application for {selectedJob.title}
                </h2>
                <p className="text-gray-600 text-lg">
                  Please fill out the form below to apply for this position
                </p>
              </div>

              <form className="appointment-form" onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={applicationForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={applicationForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={applicationForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={applicationForm.phone}
                      onChange={handleInputChange}
                      placeholder="(XXX) XXX-XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Resume/CV *</label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleInputChange}
                    required
                  />
                  <small style={{ color: "#666", fontSize: "12px" }}>
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </small>
                </div>

                <div className="form-group">
                  <label>Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    value={applicationForm.coverLetter}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Job Requirements:
                  </h4>
                  <ul className="space-y-2 ml-6 list-disc text-gray-700">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* GENERAL APPLICATION */}
      {!selectedJob && (
        <section className="relative py-20 md:py-28 reveal-on-scroll bg-gradient-to-r from-primary via-blue-700 to-indigo-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Don't See a Position That Fits?
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                We're always looking for talented individuals. Send us your
                resume and we'll keep it on file for future opportunities.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Contact HR Department
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
        </section>
      )}
    </>
  );
};

export default JobsCareers;
