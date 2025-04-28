import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ViewProjectChapters = ({ studentUserId }) => {
  const { authTokens, user } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chapters/files_list/${user.role === 'student' ? user.user_id : studentUserId}/`,
          {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }
        );
        setProjectData(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [studentUserId, authTokens]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-12 h-12 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-4xl mx-auto">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p className="text-red-700">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {user.role === 'student' ? 'My Project Chapters' : 'Student Submissions'}
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto"></div>
      </div>

      {projectData && projectData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectData.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {chapter.chapter_name}
                    </h2>
                    <p className="text-gray-500 text-sm">{chapter.name}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Uploaded: {new Date(chapter.uploaded_at).toLocaleDateString()}
                  </div>

                  {chapter.status && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      chapter.status === 'approved' ? 'bg-green-100 text-green-800' :
                      chapter.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex space-x-3">
                  <a
                    href={chapter.file}
                    download
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>

                  {user.role === 'student' && (
                    <Link
                      to={`/view_project_detail/${chapter.id}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-600 mt-4">No chapters found</h3>
          <p className="text-gray-500 mt-2 mb-4">
            {user.role === 'student' 
              ? "You haven't uploaded any chapters yet" 
              : "The student hasn't uploaded any chapters yet"}
          </p>
          {user.role === 'student' && (
            <Link 
              to="/create_project_chapters" 
              className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload First Chapter
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProjectChapters;