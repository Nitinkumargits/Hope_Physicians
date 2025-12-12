/**
 * Patient Layout Component
 * Wraps patient pages with navigation and layout
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../ProtectedRoute";
import * as notificationService from "../../services/notificationService";
import {
  FaHome,
  FaCalendarAlt,
  FaFileMedical,
  FaDollarSign,
  FaPills,
  FaUser,
  FaShieldAlt,
  FaComments,
  FaHospital,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
} from "react-icons/fa";

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.patientId) {
        try {
          const response = await notificationService.getPatientUnreadCount(
            user.patientId
          );
          if (response.success) {
            setUnreadCount(response.count || 0);
          }
        } catch (error) {
          console.error("Error fetching unread notification count:", error);
        }
      }
    };

    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const menuItems = [
    { path: "/patient", label: "Dashboard", icon: FaHome },
    {
      path: "/patient/appointments",
      label: "Appointments",
      icon: FaCalendarAlt,
    },
    { path: "/patient/prescriptions", label: "Prescriptions", icon: FaPills },
    { path: "/patient/reports", label: "Reports", icon: FaFileMedical },
    { path: "/patient/billing", label: "Billing", icon: FaDollarSign },
    { path: "/patient/insurance", label: "Insurance", icon: FaShieldAlt },
    { path: "/patient/chat", label: "Chat Support", icon: FaComments },
    { path: "/patient/admission", label: "Admission", icon: FaHospital },
    { path: "/patient/profile", label: "Profile", icon: FaUser },
    {
      path: "/patient/kyc-documents",
      label: "KYC Documents",
      icon: FaFileMedical,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/portal/login");
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-600">
              <Link to="/patient" onClick={() => setSidebarOpen(false)}>
                <h2 className="text-xl font-bold text-white">
                  Hope Physicians
                </h2>
                <p className="text-sm text-white/90 capitalize mt-1">
                  Patient Portal
                </p>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-md scale-[1.02]"
                            : "text-gray-700 hover:bg-gray-100 hover:text-primary hover:shadow-sm"
                        }`}>
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r shadow-sm"></div>
                        )}
                        <Icon
                          className={`w-5 h-5 transition-all duration-200 ${
                            isActive
                              ? "text-white"
                              : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                          }`}
                        />
                        <span
                          className={`font-medium flex-1 ${
                            isActive
                              ? "text-white"
                              : "text-gray-700 group-hover:text-primary"
                          }`}>
                          {item.label}
                        </span>
                        {!isActive && (
                          <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
                {/* Notifications Link with Badge */}
                <li>
                  <Link
                    to="/patient/notifications"
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      location.pathname === "/patient/notifications"
                        ? "bg-primary text-white shadow-md scale-[1.02]"
                        : "text-gray-700 hover:bg-gray-100 hover:text-primary hover:shadow-sm"
                    }`}>
                    {location.pathname === "/patient/notifications" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r shadow-sm"></div>
                    )}
                    <FaBell
                      className={`w-5 h-5 transition-all duration-200 ${
                        location.pathname === "/patient/notifications"
                          ? "text-white"
                          : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                      }`}
                    />
                    <span
                      className={`font-medium flex-1 ${
                        location.pathname === "/patient/notifications"
                          ? "text-white"
                          : "text-gray-700 group-hover:text-primary"
                      }`}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span
                        className={`flex items-center justify-center min-w-[20px] h-5 px-2 rounded-full text-xs font-semibold ${
                          location.pathname === "/patient/notifications"
                            ? "bg-white text-primary"
                            : "bg-primary text-white shadow-sm animate-pulse"
                        }`}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                    {location.pathname !== "/patient/notifications" && (
                      <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    )}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {user && (
                <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center font-semibold shadow-md">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email || "patient@example.com"}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded capitalize">
                      patient
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm">
                <FaSignOutAlt className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700">
                <FaBars className="text-xl" />
              </button>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Patient Portal
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Welcome{user?.name ? `, ${user.name}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold shadow-sm">
                    {(user.name || "P").charAt(0).toUpperCase()}
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PatientLayout;
