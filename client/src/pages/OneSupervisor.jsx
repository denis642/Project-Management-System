import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";

const OneSupervisor = () => {
  const { user_id } = useParams(); // Get the user_id from the URL params
  const { authTokens, user } = useContext(AuthContext); // Get user info and tokens from AuthContext
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Only fetch data if the user is a supervisor
    if (user.role !== "supervisor") {
      setLoading(false);
      return;
    }

    // Fetch supervisor profile data for the logged-in user
    const url = `http://localhost:8000/user/onesupervisor/${user.user_id}/`; // Use the logged-in user's ID
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => {
        setProfileData(response.data); // Set the profile data
        setLoading(false); // Stop loading when data is retrieved
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
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

  // If the user is not a supervisor, show a message
  if (user.role !== "supervisor") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Access Denied
        </h2>
        <p className="text-center text-gray-500">
          This page is only accessible to supervisors.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-2 sm:px-30 px-2 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-center text-green-600">
        Supervisor Information
      </h2>

      {profileData ? (
        <div className="p-4 border border-gray-300 rounded-md text-center ">
          <h3 className="text-xl font-semibold my-4">
            {profileData.first_name || "No first name"}{" "}
            {profileData.last_name || "No last name"}
          </h3>

          <section className="grid sm:grid-cols-2 grid-cols-1 gap-4 my-4">
            <p className="text-gray-600 border-1 font-semibold px-4 py-2 rounded-md border-green-600  ">
              Department: {profileData.department || "N/A"}
            </p>
            <p className="text-gray-600 border-1 font-semibold px-4 py-2 rounded-md border-green-600">
              Username: {user.username}
            </p>
          </section>

          <fieldset className="border-1 border-green-600 p-4 rounded-lg">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Email:
            </legend>
            <p className="text-black font-semibold">
              {profileData.user.email || "N/A"}
            </p>
          </fieldset>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No profile data available or data is incomplete.
        </p>
      )}
    </div>
  );
};

export default OneSupervisor;
