import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { FaUserGraduate } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";

const ViewProfile = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authTokens, user } = useContext(AuthContext);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (user.role === "supervisor") {
        url = `http://localhost:8000/user/onesupervisor/${user.user_id}/`;
      } else if (user.role === "student") {
        url = `http://localhost:8000/user/onestudentlead/${user.user_id}/`;
      } else {
        setLoading(false);
        return;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProfile = () => {
    if (!showProfile) {
      fetchProfileData();
    }
    setShowProfile(!showProfile);
  };

  return (
    <>
      {/* Profile Trigger Button */}
      <div className="z-10">
        <button
          onClick={toggleProfile}
          className="relative p-2 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="View profile"
        >
          <FaUserGraduate className="w-6 h-6" />
          {showProfile && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Profile Overlay */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleProfile}
              aria-label="Close profile"
            >
              <AiOutlineClose className="w-5 h-5 text-gray-600" />
            </button>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
              </div>
            )}

            {/* Profile Content */}
            {!loading && profileData && (
              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-green-700">
                      {user.role === "supervisor"
                        ? profileData.first_name?.charAt(0) || "S"
                        : profileData.student_lead.first_name?.charAt(0) || "S"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.role === "supervisor"
                      ? `${profileData.first_name || ""} ${profileData.last_name || ""}`
                      : `${profileData.student_lead.first_name || ""} ${profileData.student_lead.last_name || ""}`}
                  </h2>
                  <p className="text-green-600 font-medium mt-1">
                    {user.role === "supervisor" ? "Supervisor" : "Student Lead"}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Supervisor Profile */}
                {user.role === "supervisor" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Department</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {profileData.department || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                        <p className="text-lg font-medium text-gray-800">{user.username}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                      <p className="text-lg font-medium text-gray-800">
                        {profileData.user.email || "Not specified"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Student Profile */}
                {user.role === "student" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Programme</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {profileData.student_lead.programme || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Admission No</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {user.username || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Supervisor</h4>
                      <p className="text-lg font-medium text-gray-800">
                        {profileData.student_lead.supervisor
                          ? `${profileData.student_lead.supervisor.first_name} ${profileData.student_lead.supervisor.last_name}`
                          : "Not assigned"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                        <p className="text-lg font-medium text-gray-800">{user.username}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                        <p className="text-lg font-medium text-gray-800">
                          {profileData.student_lead.user.email || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Button */}
                <div className="mt-8 flex justify-center">
                  <button className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !profileData && (
              <div className="p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaUserGraduate className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Profile Not Found</h3>
                <p className="text-gray-500 mb-6">
                  {"We couldn't find your profile information. Please try again later or contact support."}
                </p>
                <button
                  onClick={toggleProfile}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProfile;