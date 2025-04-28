import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Sidebar = ({ scrollToSection, isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Determine if the current view is mobile
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeSidebar = () => {
    if (isMobileView) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleNavigation = (action) => {
    if (typeof action === 'function') {
      action();
    }
    closeSidebar();
  };

  // Navigation items configuration
  const navItems = [
    {
      path: "/profile",
      label: "Create/Update Profile",
      icon: "👤",
      visible: true
    },
    {
      path: "/create_project",
      label: "Create/Update Project",
      icon: "📝",
      visible: user?.role === "student"
    },
    {
      path: "/create_project_chapters",
      label: "Add Project Chapters",
      icon: "📑",
      visible: user?.role === "student"
    },
    {
      path: "/add_member",
      label: "Add Project Members",
      icon: "👥",
      visible: user?.role === "student"
    },
    {
      action: () => scrollToSection("chat"),
      label: "Continue Chatting",
      icon: "💬",
      visible: user?.role === "student"
    },
    {
      action: () => scrollToSection("project"),
      label: "Project Data",
      icon: "📊",
      visible: user?.role === "student"
    },
    {
      action: () => scrollToSection("header"),
      label: "Back to Top",
      icon: "⬆️",
      visible: true
    },
    {
      action: handleLogout,
      label: "Logout",
      icon: "🚪",
      visible: true,
      isLogout: true
    }
  ];

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-50 top-14 left-1 p-2 rounded-md shadow-lg focus:outline-none transition-colors ${
          (isMobileOpen || isSidebarOpen) 
            ? "bg-red-600 text-white" 
            : "bg-green-600 text-white"
        } sm:top-20 sm:left-4`}
        aria-label="Toggle sidebar"
      >
        {(isMobileOpen || isSidebarOpen) ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-6 transition-all duration-300 ease-in-out transform ${
          isMobileView 
            ? (isMobileOpen ? "translate-x-0" : "-translate-x-full")
            : (isSidebarOpen ? "translate-x-0" : "-translate-x-full")
        } w-64 z-40 overflow-y-auto`}
      >
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {user?.role?.toUpperCase()}
          </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              item.visible && (
                <li key={index}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={closeSidebar}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        item.isLogout 
                          ? "text-red-400 hover:bg-red-900/30" 
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.action)}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        item.isLogout 
                          ? "text-red-400 hover:bg-red-900/30" 
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )}
                </li>
              )
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.username || user?.email}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
        ></div>
      )}
    </>
  );
};

Sidebar.propTypes = {
  scrollToSection: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;