import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import ViewMembers from "../ViewMembers";
import ViewProjectChapters from "./ViewProjectChapters";

const ViewProject = () => {
  const { authTokens, user } = useContext(AuthContext);
  const { user_id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("View project", response.data)
      } catch (err) {
        setError("Create profile to view more...");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [user.user_id, authTokens]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  
  if (error) return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">{error}</p>
        <Link 
          to="/create_profile" 
          className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Profile
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-700 mb-2">Project Dashboard</h2>
        <div className="w-20 h-1 bg-green-600 mx-auto"></div>
      </div>

      {projectData?.projects.length > 0 ? (
        <div className="space-y-8">
          {/* Student Lead Card */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Student Lead</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold">
                {projectData.student_lead.first_name.charAt(0)}
                {projectData.student_lead.last_name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {projectData.student_lead.first_name} {projectData.student_lead.last_name}
                </p>
                <p className="text-sm text-gray-600">Project Lead</p>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Projects
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {projectData.projects.map((project) => (
                <div 
                  key={project.user_id} 
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <h4 className="text-xl font-bold text-green-700 mb-2">{project.title}</h4>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleDateString()}
                    </span>
                    {/* <Link 
                      to={`/project/${project.id}`} 
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      View Details →
                    </Link> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Chapters Section */}
          <section className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Project Chapters</h3>
              <Link 
                to="/create_project_chapters" 
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add Chapter
              </Link>
            </div>
            <ViewProjectChapters studentId={user.studentId} />
          </section>

          {/* Project Members Section */}
          <section className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Team Members</h3>
            <ViewMembers studentId={user.studentId} />
          </section>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 className="text-xl font-medium text-gray-600 mt-4">No projects found</h3>
          <p className="text-gray-500 mt-2 mb-4">{"You haven't created any projects yet"}</p>
          <Link 
            to="/create_project" 
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Your First Project
          </Link>
        </div>
      )}
    </div>
  );
};

export default ViewProject;