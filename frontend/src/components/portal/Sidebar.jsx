import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useConfirm } from "../../hooks/useConfirm";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaUsers,
  FaFileMedical,
  FaUserCheck,
  FaClock,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBookMedical,
  FaPrescription,
  FaFileUpload,
  FaUserCircle,
  FaChartLine,
  FaTasks,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { confirm } = useConfirm();
  const [notificationCounts, setNotificationCounts] = useState({});

  useEffect(() => {
    // Fetch notification counts dynamically
    const fetchNotificationCounts = async () => {
      try {
        // In production, this would call an API
        // For now, using mock data that updates
        const counts = {
          "/admin/notifications": 3,
          "/admin/kyc-review": 8, // KYC badge count
          "/doctor/notifications": 5,
          "/patient/notifications": 2,
          "/staff/notifications": 1,
        };
        setNotificationCounts(counts);
      } catch (error) {
        console.error("Failed to fetch notification counts:", error);
      }
    };

    fetchNotificationCounts();
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchNotificationCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    if (
      path === "/admin" ||
      path === "/doctor" ||
      path === "/patient" ||
      path === "/staff"
    ) {
      return location.pathname === path;
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    confirm(
      "Are you sure you want to logout?",
      () => {
        logout();
        toast.success("Logged out successfully");
      },
      () => {
        // User cancelled
      }
    );
  };

  const menuItems = {
    admin: [
      { path: "/admin", icon: FaHome, label: "Dashboard", badge: null },
      {
        path: "/admin/employees",
        icon: FaUsers,
        label: "Employees",
        badge: null,
      },
      {
        path: "/admin/patients",
        icon: FaUserCircle,
        label: "Patients",
        badge: null,
      },
      { path: "/admin/doctors", icon: FaUserMd, label: "Doctors", badge: null },
      {
        path: "/admin/appointments",
        icon: FaCalendarAlt,
        label: "Appointments",
        badge: null,
      },
      {
        path: "/admin/kyc-review",
        icon: FaFileMedical,
        label: "KYC Review",
        badge: notificationCounts["/admin/kyc-review"] || 8,
      },
      {
        path: "/admin/attendance",
        icon: FaClock,
        label: "Attendance",
        badge: null,
      },
      {
        path: "/admin/reports",
        icon: FaChartLine,
        label: "Reports",
        badge: null,
      },
      {
        path: "/admin/notifications",
        icon: FaBell,
        label: "Notifications",
        badge: notificationCounts["/admin/notifications"] || 3,
      },
      { path: "/admin/settings", icon: FaCog, label: "Settings", badge: null },
    ],
    doctor: [
      { path: "/doctor", icon: FaHome, label: "Dashboard", badge: null },
      {
        path: "/doctor/appointments",
        icon: FaCalendarAlt,
        label: "Appointments",
        badge: null,
      },
      {
        path: "/doctor/patients",
        icon: FaUserCircle,
        label: "Patients",
        badge: null,
      },
      {
        path: "/doctor/calendar",
        icon: FaCalendarAlt,
        label: "Calendar",
        badge: null,
      },
      {
        path: "/doctor/prescriptions",
        icon: FaPrescription,
        label: "Prescriptions",
        badge: null,
      },
      {
        path: "/doctor/notifications",
        icon: FaBell,
        label: "Notifications",
        badge: notificationCounts["/doctor/notifications"],
      },
    ],
    patient: [
      { path: "/patient", icon: FaHome, label: "Dashboard", badge: null },
      {
        path: "/patient/appointments",
        icon: FaCalendarAlt,
        label: "My Appointments",
        badge: null,
      },
      {
        path: "/appointment",
        icon: FaBookMedical,
        label: "Book Appointment",
        badge: null,
      },
      {
        path: "/patient/profile",
        icon: FaUserCircle,
        label: "Profile",
        badge: null,
      },
      {
        path: "/patient/kyc-documents",
        icon: FaFileUpload,
        label: "KYC Documents",
        badge: null,
      },
      {
        path: "/patient/notifications",
        icon: FaBell,
        label: "Notifications",
        badge: notificationCounts["/patient/notifications"],
      },
    ],
    staff: [
      { path: "/staff", icon: FaHome, label: "Dashboard", badge: null },
      { path: "/staff/tasks", icon: FaTasks, label: "My Tasks", badge: null },
      {
        path: "/staff/attendance",
        icon: FaClock,
        label: "Attendance",
        badge: null,
      },
      {
        path: "/staff/kyc-assistance",
        icon: FaFileMedical,
        label: "KYC Assistance",
        badge: 3,
      },
      {
        path: "/staff/appointments",
        icon: FaCalendarAlt,
        label: "Appointments",
        badge: null,
      },
      {
        path: "/staff/notifications",
        icon: FaBell,
        label: "Notifications",
        badge: notificationCounts["/staff/notifications"],
      },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
          w-64 border-r border-gray-200
        `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-600">
            <Link to={user?.role ? `/${user.role}` : "/"} onClick={onClose}>
              <h2 className="text-xl font-bold text-white">Hope Physicians</h2>
              <p className="text-sm text-white/90 capitalize mt-1">
                {user?.role || "User"} Portal
              </p>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const handleClick = (e) => {
                  onClose();
                  // Add click feedback
                  const element = e.currentTarget;
                  element.style.transform = "scale(0.98)";
                  setTimeout(() => {
                    element.style.transform = "";
                  }, 150);
                };

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={handleClick}
                      className={`
                        group relative flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200 cursor-pointer
                        ${
                          active
                            ? "bg-primary text-white shadow-md scale-[1.02]"
                            : "text-gray-700 hover:bg-gray-100 hover:text-primary hover:shadow-sm"
                        }
                      `}
                      aria-current={active ? "page" : undefined}>
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r shadow-sm"></div>
                      )}

                      <Icon
                        className={`w-5 h-5 transition-all duration-200 ${
                          active
                            ? "text-white"
                            : "text-gray-500 group-hover:text-primary"
                        } ${!active && "group-hover:scale-110"}`}
                      />

                      <span
                        className={`font-medium flex-1 ${
                          active
                            ? "text-white"
                            : "text-gray-700 group-hover:text-primary"
                        }`}>
                        {item.label}
                      </span>

                      {/* Badge */}
                      {item.badge && item.badge > 0 && (
                        <span
                          className={`
                          flex items-center justify-center min-w-[20px] h-5 px-2 rounded-full text-xs font-semibold
                          animate-pulse
                          ${
                            active
                              ? "bg-white text-primary shadow-sm"
                              : "bg-primary text-white shadow-sm"
                          }
                        `}>
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}

                      {/* Hover effect */}
                      {!active && (
                        <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center font-semibold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded capitalize">
                  {user?.role || "user"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm">
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
