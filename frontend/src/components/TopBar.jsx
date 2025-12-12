import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaFlag } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 flex-wrap gap-2">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 flex-wrap text-gray-700">
            <span className="text-gray-600">Interested? Call Us Today!</span>
            <a
              href="tel:2525223663"
              className="hover:text-primary transition-colors font-medium">
              252-522-3663
            </a>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline text-gray-600">
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
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="Facebook">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/hopephysicians"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
              <button
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="Language/Region">
                <FaFlag className="w-4 h-4" />
              </button>
            </div>

            {/* Care Plan Assessment Button */}
            <Link
              to="/appointment"
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
              Care Plan Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
