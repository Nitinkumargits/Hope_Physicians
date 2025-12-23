import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaFlag, FaPhoneAlt } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="topbar-modern text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 flex-wrap gap-2">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 flex-wrap text-slate-100 modern-text">
            <span className="flex items-center gap-2 text-slate-50">
              <FaPhoneAlt className="w-4 h-4 phone-badge" aria-hidden="true" />
              Interested? Call Us Today!
            </span>
            <a
              href="tel:2525223663"
              className="modern-link font-semibold">
              252-522-3663
            </a>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-100">
              Our Location: 2104 North Heritage St. • Kinston, NC 28501
            </span>
          </div>

          {/* Right: Social Icons & Button */}
          <div className="flex items-center gap-3">
            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/hopephysicians"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-pill"
                aria-label="Facebook">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/hopephysicians"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-pill"
                aria-label="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
              <button
                className="icon-pill"
                aria-label="Language/Region">
                <FaFlag className="w-4 h-4" />
              </button>
            </div>

            {/* Care Plan Assessment Button */}
            <Link
              to="/appointment"
              className="modern-cta">
              Care Plan Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
