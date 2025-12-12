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
    <footer className="bg-primary text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Contact Details */}
          <div className="space-y-6">
            <div>
              <p className="text-white/80 text-sm uppercase tracking-wide mb-2">
                Get in Touch
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Contact Details
              </h3>
            </div>

            <ul className="space-y-4 text-white">
              <li className="flex items-center gap-3">
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
                <span className="font-medium">Phone:</span>
                <a
                  href={`tel:${contactInfo.phone1.replace(/-/g, "")}`}
                  className="hover:underline">
                  {contactInfo.phone1}
                </a>
              </li>
              <li className="flex items-center gap-3">
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
                <span className="font-medium">Fax:</span>
                <span>{contactInfo.phone2}</span>
              </li>
              <li className="flex items-center gap-3">
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
                <span className="font-medium">Email:</span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:underline break-all">
                  {contactInfo.email}
                </a>
              </li>
            </ul>

            <p className="text-white/90 text-sm leading-relaxed max-w-md">
              Contact us today to learn more about our services and how we can
              help you and your family.
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-white">Our Location</h4>
              <p className="text-white/90 text-sm">{contactInfo.address}</p>
              <a
                href={contactInfo.addressUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-teal-400 hover:text-teal-300 text-sm font-medium hover:underline">
                View Map & Directions →
              </a>
            </div>
          </div>

          {/* Right: Quick Links & Social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-white/90">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="hover:text-white transition-colors inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Visit our Facebook page">
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Visit our Twitter page">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Visit our LinkedIn page">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Visit our Instagram page">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="mt-10 border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/80">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span>© Copyright {new Date().getFullYear()}</span>
              <Link
                to="/privacy-policy"
                className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="text-white/80">
              <span className="font-semibold">Hope Physicians</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
