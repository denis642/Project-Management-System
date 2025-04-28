import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Header from "../../components/Header";

const CreateProjectChapters = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [name, setName] = useState("");
  const [uploadStatus, setUploadStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Create preview for images
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    setUploadStatus({ message: "", type: "" });

    if (!selectedFile || !chapterName || !name) {
      setUploadStatus({ message: "Please fill all fields and select a file.", type: "error" });
      setLoading(false);
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setUploadStatus({ message: "File size exceeds 2MB limit.", type: "error" });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("chapter_name", chapterName);
    formData.append("name", name);
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/chapters/files/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      if (response.status === 201) {
        setUploadStatus({ 
          message: "File uploaded successfully! Redirecting...", 
          type: "success" 
        });
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         "Failed to upload file. Please try again.";
      setUploadStatus({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Chapter File</h1>
            <p className="text-gray-600">Add a new chapter to your project</p>
          </div>

          {uploadStatus.message && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 ${
              uploadStatus.type === "error" 
                ? "bg-red-50 border-red-500 text-red-700" 
                : "bg-green-50 border-green-500 text-green-700"
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {uploadStatus.type === "error" ? (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{uploadStatus.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="chapterName" className="block text-sm font-medium text-gray-700 mb-1">
                Chapter Number/Identifier
              </label>
              <input
                id="chapterName"
                type="text"
                placeholder="e.g. Chapter 1, Introduction, etc."
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Chapter Title
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Project Introduction, Methodology, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Chapter File (Max 2MB)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 2MB</p>
                </div>
              </div>
              
              {filePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">File Preview:</p>
                  {selectedFile.type.startsWith('image/') ? (
                    <img src={filePreview} alt="Preview" className="max-h-60 rounded-lg border border-gray-200" />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload Chapter"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectChapters;