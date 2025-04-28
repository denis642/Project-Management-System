


import { Link } from "react-router-dom"


const About = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
              <button className="border-2 border-orange-400 rounded-xl py-1 px-4 my-8">
            <Link to="/">return</Link>
        </button>
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} WPMS. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-2">
          <a href="#" className="hover:text-blue-400 transition duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition duration-200">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition duration-200">Contact Us</a>
        </div>
        <div className="mt-4">
          <p className="text-sm">Follow us on:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-blue-400 transition duration-200">Facebook</a>
            <a href="#" className="hover:text-blue-400 transition duration-200">Twitter</a>
            <a href="#" className="hover:text-blue-400 transition duration-200">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default About;

