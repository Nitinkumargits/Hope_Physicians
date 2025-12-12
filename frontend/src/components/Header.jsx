import { Link } from "react-router-dom";
import logo from "../assets/images/hope_phy_logo.webp";

const Header = () => {
  return (
    <header className="relative z-20 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* LEFT: Logo + Name */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src={logo}
                className="h-full w-full object-cover"
                alt="Hope Physicians Logo"
              />
            </div>
            <h1
              className="text-xl md:text-2xl font-bold text-primary"
              style={{ fontFamily: "serif" }}>
              Hope Physicians
            </h1>
          </Link>

          {/* CENTER: Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            <ul className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <li>
                <Link
                  className="px-4 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition"
                  to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="px-4 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition"
                  to="/about">
                  About Us
                </Link>
              </li>
              <li className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition cursor-pointer text-gray-700 focus:outline-none">
                  Services <span className="text-xs">▼</span>
                </button>
                <ul className="absolute left-0 mt-2 min-w-[220px] rounded-lg bg-white text-gray-800 shadow-xl border border-gray-200 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition duration-200 z-30">
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/family-medicine">
                      Family Medicine
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/pediatric-care">
                      Pediatric Care
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/mens-health">
                      Men's Health
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/womens-health">
                      Women's Health
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/occupational-health">
                      Occupational Health
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/geriatric-care">
                      Geriatric Care
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  className="px-4 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition"
                  to="/jobs-careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="px-4 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition"
                  to="/contact">
                  Contact Us
                </Link>
              </li>
              <li className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition cursor-pointer text-gray-700 focus:outline-none">
                  Resources <span className="text-xs">▼</span>
                </button>
                <ul className="absolute left-0 mt-2 min-w-[220px] rounded-lg bg-white text-gray-800 shadow-xl border border-gray-200 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition duration-200 z-30">
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/patient-form">
                      Patient Form
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/insurance-inquiry">
                      Insurance Inquiry
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/payment-policy">
                      Payment Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/insurance">
                      Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/local-resources">
                      Local Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-gray-50"
                      to="/faqs">
                      FAQs
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
