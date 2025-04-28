import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';

const AddMember = () => {
    const { user_id } = useParams();
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [participants, setParticipants] = useState([
        { first_name: "", last_name: "", admision_no: "", programme: "", mail: "" },
    ]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, e) => {
        const newParticipants = [...participants];
        newParticipants[index][e.target.name] = e.target.value;
        setParticipants(newParticipants);
    };

    const addParticipant = () => {
        setParticipants([...participants, { first_name: "", last_name: "", admision_no: "", programme: "", mail: "" }]);
    };

    const removeParticipant = (index) => {
        const newParticipants = participants.filter((_, i) => i !== index);
        setParticipants(newParticipants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const requestData = {
            participants: participants.map((participant) => ({
                ...participant,
                user: user.id,
            })),
        };

        const url = "http://localhost:8000/members/create/";

        try {
            await axios.post(url, requestData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });
            navigate(`/view_project/${user_id}`);
        } catch (err) {
            if (err.response?.data) {
                setError(err.response.data.non_field_errors?.join(", ") || "An error occurred.");
            } else {
                setError("A network error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800">Add Project Members</h1>
                        <p className="mt-1 text-gray-600">Enter details for each team member</p>
                    </div>

                    <div className="px-6 py-4">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {participants.map((participant, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Member #{index + 1}</h3>
                                        {participants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeParticipant(index)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor={`first_name_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                id={`first_name_${index}`}
                                                type="text"
                                                name="first_name"
                                                value={participant.first_name}
                                                onChange={(e) => handleChange(index, e)}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor={`last_name_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                id={`last_name_${index}`}
                                                type="text"
                                                name="last_name"
                                                value={participant.last_name}
                                                onChange={(e) => handleChange(index, e)}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor={`admision_no_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                Admission Number
                                            </label>
                                            <input
                                                id={`admision_no_${index}`}
                                                type="text"
                                                name="admision_no"
                                                value={participant.admision_no}
                                                onChange={(e) => handleChange(index, e)}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor={`programme_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                Programme
                                            </label>
                                            <input
                                                id={`programme_${index}`}
                                                type="text"
                                                name="programme"
                                                value={participant.programme}
                                                onChange={(e) => handleChange(index, e)}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor={`mail_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                id={`mail_${index}`}
                                                type="email"
                                                name="mail"
                                                value={participant.mail}
                                                onChange={(e) => handleChange(index, e)}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={addParticipant}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Another Member
                                </button>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to={`/home`}
                                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding Members...
                                            </>
                                        ) : "Submit Members"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMember;