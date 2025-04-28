import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Header from "../../components/Header";

const UpdateMemberForm = () => {
  const { authTokens } = useContext(AuthContext);
  const { member_id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    first_name: "",
    last_name: "",
    admision_no: "",
    programme: "",
    mail: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch member details on component mount
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/members/view_one_member/${member_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setMember(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [member_id, authTokens]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.put(
        `http://localhost:8000/members/update/${member_id}/`,
        member,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500); // Redirect after showing success
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h1 className="text-2xl font-bold">Update Member</h1>
            <p className="opacity-90">Edit the member information below</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-6 mt-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>Member updated successfully!</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Error updating member</p>
                  {error.detail && <p className="text-sm">{error.detail}</p>}
                  {error.errors && (
                    <ul className="list-disc list-inside text-sm mt-1">
                      {Object.entries(error.errors).map(([field, messages]) => (
                        <li key={field}>{messages.join(", ")}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="first_name"
                value={member.first_name}
                onChange={handleChange}
                required
              />
              <FormField
                label="Last Name"
                name="last_name"
                value={member.last_name}
                onChange={handleChange}
                required
              />
              <FormField
                label="Admission No"
                name="admision_no"
                value={member.admision_no}
                onChange={handleChange}
                required
              />
              <FormField
                label="Programme"
                name="programme"
                value={member.programme}
                onChange={handleChange}
                required
              />
              <div className="md:col-span-2">
                <FormField
                  label="Email"
                  name="mail"
                  type="email"
                  value={member.mail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center px-5 py-2.5 rounded-lg text-white ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable form field component
const FormField = ({ label, name, type = "text", value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

export default UpdateMemberForm;