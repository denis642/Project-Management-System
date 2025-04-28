import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useParams } from 'react-router-dom';

const ProfileView = () => {
  const { user_id } = useParams();
  const { authTokens, user } = useContext(AuthContext); // Get user info and tokens from AuthContext
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Only fetch data if the user is a student
    if (user.role !== "student") {
      setLoading(false);
      return;
    }

    // Fetch student profile data for the logged-in user
    const url = `http://localhost:8000/user/onestudentlead/${user.user_id}/`; // Use the logged-in user's ID
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => {
        setProfileData(response.data); // Set the profile data
        setLoading(false); // Stop loading when data is retrieved
        // console.log(response.data.student_lead.supervisor.first_name)
      })
      .catch((error) => {
        // console.error("Error fetching profile data:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, [user.role, authTokens, user.user_id]);

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // If the user is not a student, show a message
  if (user.role !== "student") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Access Denied</h2>
        <p className="text-center text-gray-500">
          This page is only accessible to students.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-2 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-center text-green-600">Student Lead Information</h2>

      {profileData ? (
        <div className="p-4  rounded-md  text-center">
          <h3 className="text-xl font-semibold">
            {profileData.student_lead.first_name || "No first name"} {profileData.student_lead.last_name || "No last name"}
          </h3>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <p className="text-gray-900  border border-green-300 p-2"><span className="font-semibold">Programme</span>: {profileData.student_lead.programme || "N/A"}</p>
            <p className="text-gray-900 border border-green-300 p-2">
              <span className="font-semibold">Supervisor</span>:{" "}
              {profileData?.student_lead?.supervisor
                ? `${profileData.student_lead.supervisor.first_name} ${profileData.student_lead.supervisor.last_name}`
                : "N/A"}
            </p>

          </section>
          <p className="text-gray-600 my-4"><span className="font-semibold">Username</span>: {user.username}</p>
          <p className="text-gray-600"><span className="font-semibold">Gmail</span>: {profileData.student_lead.user.email || "N/A"}</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">  </p>
      )}

    </div>
  );
};

export default ProfileView;