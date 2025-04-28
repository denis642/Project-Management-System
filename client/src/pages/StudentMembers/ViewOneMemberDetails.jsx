import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Header from "../../components/Header";

const ViewOneMemberDetails = () => {
  const { authTokens } = useContext(AuthContext);
  const { member_id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

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
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [member_id, authTokens]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await axios.delete(
          `http://localhost:8000/members/delete/${member_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        navigate('/home', { state: { message: 'Member deleted successfully' } });
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit_member_details/${member_id}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-500 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 font-medium">Error loading member details</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h1 className="text-2xl font-bold">Member Details</h1>
            <p className="opacity-90">View and manage member information</p>
          </div>

          {/* Content Section */}
          {member ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h2>
                  <DetailItem label="First Name" value={member.first_name} />
                  <DetailItem label="Last Name" value={member.last_name} />
                  <DetailItem label="Admission No" value={member.admision_no} />
                </div>

                {/* Academic Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Academic Information</h2>
                  <DetailItem label="Programme" value={member.programme} />
                  <DetailItem label="Email" value={member.mail} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleEdit}
                  className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Member
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`flex items-center px-5 py-2.5 ${isDeleting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-colors shadow-sm`}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete Member
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to List
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No member details found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable component for detail items
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center">
    <span className="text-sm font-medium text-gray-500 sm:w-1/3">{label}</span>
    <span className="mt-1 sm:mt-0 sm:w-2/3 text-gray-800 font-medium">{value || '-'}</span>
  </div>
);

export default ViewOneMemberDetails;