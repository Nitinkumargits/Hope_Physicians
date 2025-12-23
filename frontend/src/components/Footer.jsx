import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  // Social media links (can be configured via environment variables or config)
  const socialLinks = {
    facebook: "https://www.facebook.com/hopephysicians",
    twitter: "https://twitter.com/hopephysicians",
    linkedin: "https://www.linkedin.com/company/hopephysicians",
    instagram: "https://www.instagram.com/hopephysicians",
  };

  // Contact information
  const contactInfo = {
    address: "2104 North Herritage Street, Kinston, NC 28501",
    addressUrl:
      "https://www.google.com/maps/search/?api=1&query=2104+North+Herritage+Street+Kinston+NC+28501",
    phone1: "252-522-3663",
    phone2: "252-523-3660",
    email: "hopephysician90@gmail.com",
  };

  // Quick links
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/departments" },
    { label: "Doctors", path: "/doctors" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="footer-enhanced bg-primary text-white relative overflow-hidden">
      {/* Curved Line Decoration */}
      <div className="line-curv">
        <svg
          width="100%"
          height="60"
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none">
          <path
            d="M0,60 L0,0 L1440,0 L1440,60 C1200,60 800,0 720,0 C640,0 240,60 0,60 Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-3">
          {/* Left: Contact Details */}
          <div className="space-y-6 footer-contact-section">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider mb-3 font-semibold">
                Get in Touch
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                Contact Details
              </h3>
            </div>

            <ul className="space-y-4 text-white footer-contact-list">
              <li className="flex items-start gap-4 footer-contact-item">
                <div className="footer-icon-wrapper">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white/90 block mb-1">Phone:</span>
                  <a
                    href={`tel:${contactInfo.phone1.replace(/-/g, "")}`}
                    className="text-white hover:text-teal-300 transition-colors text-sm">
                    {contactInfo.phone1}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 footer-contact-item">
                <div className="footer-icon-wrapper">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white/90 block mb-1">Fax:</span>
                  <span className="text-white text-sm">{contactInfo.phone2}</span>
                </div>
              </li>
              <li className="flex items-start gap-4 footer-contact-item">
                <div className="footer-icon-wrapper">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white/90 block mb-1">Email:</span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-white hover:text-teal-300 transition-colors text-sm break-all">
                    {contactInfo.email}
                  </a>
                </div>
              </li>
            </ul>

            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              Contact us today to learn more about our services and how we can
              help you and your family.
            </p>

            <div className="footer-location-box">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Our Location
              </h4>
              <p className="text-white/90 text-sm mb-3 leading-relaxed">{contactInfo.address}</p>
              <a
                href={contactInfo.addressUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors group">
                View Map & Directions
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
              </a>
            </div>
          </div>

          {/* Middle: Quick Links */}
          <div className="space-y-6 footer-links-section">
            <div>
              <h3 className="text-lg font-bold text-white mb-5">
                Quick Links
              </h3>
              <ul className="space-y-3 footer-links-list">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="footer-link-item">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right: Social Media */}
          <div className="space-y-6 footer-social-section">
            <div>
              <h3 className="text-lg font-bold text-white mb-5">
                Follow Us
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Stay connected with us on social media
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Visit our Facebook page">
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Visit our Twitter page">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Visit our LinkedIn page">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Visit our Instagram page">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="footer-bottom-bar mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span>© Copyright {new Date().getFullYear()}</span>
              <span className="hidden md:inline">•</span>
              <Link
                to="/privacy-policy"
                className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="text-white/80">
              <span className="font-bold text-white">Hope Physicians</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
