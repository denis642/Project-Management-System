import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import projectsvg from "../assets/images/svg/project.svg";

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("userRole");
      setRole(null);
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const toggleLogoutConfirm = () => {
    setShowLogoutConfirm(!showLogoutConfirm);
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo and Greeting */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/home" 
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <img 
                src={projectsvg} 
                alt="Project Management" 
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold text-gray-800 hidden md:inline">
                WPMS
              </span>
            </Link>
            
            <div className="hidden md:block border-l border-gray-200 h-6"></div>
            
            <p className="text-gray-600 hidden md:block">
              Welcome back, <span className="font-semibold text-blue-600">{user.username}</span>
            </p>
          </div>

          {/* Right section - User controls */}
          <div className="flex items-center space-x-4 relative">
            <div className="hidden sm:flex items-center space-x-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={toggleLogoutConfirm}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-expanded={showLogoutConfirm}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                  {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
              </button>

              {showLogoutConfirm && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-700 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={toggleLogoutConfirm}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile logout confirmation */}
      {showLogoutConfirm && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Sign Out</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={toggleLogoutConfirm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;