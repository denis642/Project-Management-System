






import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const ViewProject = () => {
    const navigate = useNavigate();
    const { authTokens, user } = useContext(AuthContext);
    const { user_id } = useParams(); // Get user_id from the URL
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
            } catch (err) {
                setError(err.response ? err.response.data.error : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [user.user_id, authTokens]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Project Details</h2>

            {projectData?.projects.length > 0 ? (
                <div className=" cursor-pointer" onClick={()=>navigate(`/view_project/${user.user_id}`)} >
                    
                    <p><strong><span className="text-xl font-semibold">Student Lead:</span></strong> {projectData.student_lead.first_name} {projectData.student_lead.last_name}</p>

                    {projectData.projects.map((project) => (
                        <div key={project.user_id} className=" p-4">
                            <p><strong>Project Title:</strong>  <span className="text-green-600 font-semibold" >{project.title}</span></p>
                        </div>
                    ))}

                    <button className="mt-4 border border-green-600 rounded-lg py-1 px-4 text-yellow-800">
                        <Link to={`/view_project/${user.user_id}`}>View more...</Link>
                    </button>
                </div>
            ) : (
                <p className="text-gray-600 text-center">No projects found for this user.</p>
            )}
        </div>
    );
};

export default ViewProject;
