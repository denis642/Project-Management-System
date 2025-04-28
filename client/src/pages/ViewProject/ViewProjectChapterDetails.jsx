import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Header from '../../components/Header';
import { FiDownload, FiTrash2, FiArrowLeft } from "react-icons/fi";

const ViewProjectChapterDetails = () => {
  const { fileId } = useParams();
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chapters/files/${fileId}/`,
          {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }
        );
        setChapter(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [fileId, authTokens]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Chapter</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mx-auto"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Chapter Not Found</h2>
          <p className="text-gray-600 mb-6">The requested chapter could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mx-auto"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Chapter Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">{chapter.chapter_name}</h1>
                <p className="text-green-100">{chapter.name}</p>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {new Date(chapter.uploaded_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg font-semibold text-gray-700 mb-1">File Details</h2>
                <p className="text-gray-500 text-sm">
                  Uploaded: {new Date(chapter.uploaded_at).toLocaleString()}
                </p>
              </div>
              
              <a
                href={chapter.file}
                download
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiDownload className="mr-2" />
                Download File
              </a>
            </div>

            {/* File Preview Placeholder */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center mb-8">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-gray-500">File preview would be displayed here</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/chapters_delete/${chapter.id}`)}
                className="flex items-center justify-center px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FiTrash2 className="mr-2" />
                Delete Chapter
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectChapterDetails;