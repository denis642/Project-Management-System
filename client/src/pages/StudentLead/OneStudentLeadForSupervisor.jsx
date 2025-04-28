import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Chat from "../Chat/Chat";
import ViewProjectChapters from "../ViewProject/ViewProjectChapters";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const StudentLeadForSupervisor = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const { authTokens, user } = useContext(AuthContext);

  const [information, setData] = useState(null);
  const [infos, setInfos] = useState(null);
  const [projectMembers, setMember] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student lead information
  useEffect(() => {
    const fetchStudentLead = async () => {
      try {
        const url = `http://localhost:8000/user/onestudentlead/${user_id}/`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setData(response.data);
        setInfos(response.data.student_lead.user_id);
        setChatData(response.data.student_lead);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentLead();
  }, [user_id, authTokens]);

  // Fetch project members
  useEffect(() => {
    const fetchMembers = async () => {
      if (!infos) return;
      
      try {
        const url = `http://localhost:8000/members/view/${infos}/`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setMember(response.data.members);
      } catch (err) {
        setError(prev => prev ? `${prev}. ${err.message}` : err.message);
      }
    };

    fetchMembers();
  }, [infos, authTokens]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Student Lead Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Student Lead Details</h2>
          </div>
          
          {information ? (
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Student Lead</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {information.student_lead.first_name} {information.student_lead.last_name}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Programme</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {information.student_lead.programme}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Registration No</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {information.student_lead.user.username}
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h3>
                {information.projects?.length > 0 ? (
                  information.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {project.title}
                      </h4>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Description</h5>
                        <p className="text-gray-700">{project.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                    No projects found
                  </div>
                )}
              </div>

              {/* Project Chapters */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Chapters</h3>
                <ViewProjectChapters studentUserId={infos} />
              </div>

              {/* Project Members */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Team Members</h3>
                {projectMembers?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projectMembers.map((member, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900">
                          {member.first_name} {member.last_name}
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Programme:</span> {member.programme}</p>
                          <p><span className="font-medium">Reg No:</span> {member.admision_no}</p>
                          <p><span className="font-medium">Email:</span> {member.mail || "Not provided"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                    No team members found
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No student lead data available
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Chat Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Chat with Student</h3>
          </div>
          <div className="p-6">
            <Chat chatInfo={chatData} UserId={user.user_id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentLeadForSupervisor;