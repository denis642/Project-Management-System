import { useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Cookies from "js-cookie";

const DeleteChapter = () => {
  const { fileId } = useParams(); // Get the fileId from the URL
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const deleteChapter = async () => {
      try {
        const csrfToken = Cookies.get("csrftoken"); // Get the CSRF token from cookies

        // Log the CSRF token and fileId for debugging
        console.log("CSRF Token:", csrfToken);
        console.log("Deleting chapter with fileId:", fileId);

        const response = await axios.delete(
          `http://localhost:8000/chapters/files/delete/${fileId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
            },
          }
        );

        // Log the response for debugging
        console.log("Delete response:", response);

        // Redirect to the user's project page after successful deletion
        navigate(`/view_project/${user.user_id}`);
      } catch (err) {
        // Log the full error for debugging
        console.error("Error deleting chapter:", err);

      }
    };

    deleteChapter();
  }, [fileId, authTokens, navigate, user.user_id]); 

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default DeleteChapter;