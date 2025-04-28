import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import registerSvg from "../assets/images/svg/register.svg";

const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const responseErrors = await registerUser(e);
    
    if (responseErrors) {
      setErrors(responseErrors);
    } else {
      // Redirect to login after successful registration
      setTimeout(() => navigate("/"), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col sm:flex-row">
      {/* SVG Illustration Section (Hidden on mobile) */}
      <div className="hidden sm:flex flex-1 items-center justify-center p-8">
        <div className="max-w-md w-full">
          <img 
            src={registerSvg} 
            alt="Registration Illustration" 
            className="w-full h-auto object-contain"
          />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Join WPMS</h2>
            <p className="text-gray-600 mt-2">
              Start managing your projects effectively
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl font-bold text-center">Create Account</h1>
            <p className="text-center text-blue-100 mt-1">
              Join our project management system
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {errors.non_field_errors && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700">{errors.non_field_errors[0]}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Registration / Unique Code
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="CT101-G-100-12"
                    required
                    className={`w-full px-4 py-3 border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>
                  )}
                </div>
              </div>

              {/* Email and Role Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="first.second@kyu.students.co.ke"
                      required
                      className={`w-full px-4 py-3 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                    )}
                  </div>
                </div>

                {/* Role Field */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="student">Student</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    className={`w-full px-4 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  } transition-colors`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                {"Already have an account? "}
                <Link
                  to="/"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;