import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import Header from "../components/Header";
import SupervisorStudent from "./SupervisorStudent";
import ViewProject from "./ViewProject/ViewProject";
import Footer from "../components/Footer";
import ViewProfile from "./Profile/ViewProfile";
import Sidebar from "../components/Sidebar";
import Chat from "../pages/Chat/Chat";

const HomePage = () => {
  const navigate = useNavigate();
  const { authTokens, user } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Create refs for each section
  const chatRef = useRef(null);
  const headerRef = useRef(null);
  const projectRef = useRef(null);
  const dashboardRef = useRef(null);

  // State to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to scroll to a specific section
  const scrollToSection = (section) => {
    setActiveSection(section);
    let ref = null;
    
    switch (section) {
      case "chat":
        ref = chatRef;
        break;
      case "header":
        ref = headerRef;
        break;
      case "project":
        ref = projectRef;
        break;
      case "dashboard":
        ref = dashboardRef;
        break;
      default:
        break;
    }

    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/view_project/${user.user_id}/`,
          {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }
        );
        setProjectData(response.data);
        console.log("Project info: ", response.data)
      } catch (err) {
        err
        setError("Please create a profile to view more details");
      } finally {
        setLoading(false);
      }
    };

    if (user.role === "student") {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [user.user_id, authTokens, user.role]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Profile Required</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        scrollToSection={scrollToSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
      />

      {/* Mobile sidebar toggle button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed z-20 bottom-4 left-4 p-3 bg-blue-600 text-white rounded-full shadow-lg md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <div className="p-4 md:p-6">
          {/* Header and Profile Section */}
          <section className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-8" ref={headerRef}>
            <div className="md:col-span-7">
              <Header />
            </div>
            <div className="md:col-span-1">
              <ViewProfile />
            </div>
          </section>

          {/* Dashboard Overview Section */}
          <section className="mb-8" ref={dashboardRef}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800">Welcome back, {user.username}</h3>
                  <p className="text-sm text-blue-600 mt-1">{"You're logged in as a "}{user.role}</p>
                </div>
                {user.role === "student" && projectData && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="font-medium text-green-800">Current Project</h3>
                    {projectData.projects.map((project) => (
                <div 
                  key={project.user_id} 
                  className=" hover:shadow-md transition-shadow"
                >
                  <h4 className="text-xl font-bold text-green-700 mb-2">{project.title}</h4>
                  <div className="flex justify-between items-center">
                   
             
                  </div>
                </div>
              ))}
                  </div>
                )}
                { user.role === "student" &&
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800">Quick Actions</h3>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      onClick={() => scrollToSection("chat")}
                      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded"
                    >
                      Chat
                    </button>
                    <button 
                      onClick={() => scrollToSection("project")}
                      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded"
                    >
                      Project
                    </button>
                  </div>
                </div>}
              </div>
            </div>
          </section>

          {/* STUDENT PROJECT SECTION */}
          {user.role === "student" && (
            <section className="mb-8" ref={projectRef}>
              <ViewProject />
            </section>
          )}

          {/* CHAT SECTION */}
          {user.role === "student" && (
            <section className="mb-8" ref={chatRef}>
              <Chat projectData={projectData} UserId={user.user_id} />
            </section>
          )}

          {/* Supervisor Section */}
          {user.role === "supervisor" && (
            <section className="mb-8">
              <SupervisorStudent supervisorId={user.supervisorId} />
            </section>
          )}

          {/* Footer */}
          <hr className="border-t-2 my-6 border-gray-200" />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;