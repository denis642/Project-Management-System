import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Profile from './pages/Profile';
import OneStudentLead from './pages/OneStudentLead';
import OneSupervisor from './pages/OneSupervisor';
import CreateProject from './pages/CreateProject';
import ViewProject from './pages/ViewProject/ViewProject';
import StudentLeadForSupervisor from './pages/StudentLead/OneStudentLeadForSupervisor';
import LandingPage from './components/LandingPage/LandingPage';
import Blog from './components/LandingPage/Blog';
import Services from './components/LandingPage/Services';
import About from './components/LandingPage/About';
import Chat from './pages/Chat/Chat';

import AddMember from './pages/AddMember';
import ViewOneMemberDetails from './pages/StudentMembers/ViewOneMemberDetails'
import UpdateProjectMemberDetails from './pages/StudentMembers/UpdateProjectMemberDetails'

import CreateProjectChapters from './pages/ViewProject/CreateProjectChapters';
import ViewProjectChapters from './pages/ViewProject/ViewProjectChapters';
import DeleteChapter from './pages/ViewProject/DeleteChapter';
import ViewProjectChapterDetails from './pages/ViewProject/ViewProjectChapterDetails';
import ViewProfile from './pages/Profile/ViewProfile';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>

            {/* Homepage */}
            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />

            {/* Profile */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/view_profile" element={<PrivateRoute><ViewProfile /></PrivateRoute>} />

            {/* Project */}
            <Route path="/create_project" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
            <Route path="/view_project/:user_id" element={<PrivateRoute><ViewProject /></PrivateRoute>} />

             {/* project chapters. */}
            <Route path="/create_project_chapters" element={<PrivateRoute><CreateProjectChapters /></PrivateRoute>} />
            <Route path="/view_project_chapters/:user_id" element={<PrivateRoute><ViewProjectChapters /></PrivateRoute>} />
            {/* Project chapter details */}
            <Route path="/view_project_detail/:fileId" element={<PrivateRoute><ViewProjectChapterDetails /></PrivateRoute>} />
            {/* Delete chapter */}
            <Route path="/chapters_delete/:fileId" element={<DeleteChapter />} />

              {/* project members */}
            <Route path="/one_member_details/:member_id"  element={<PrivateRoute><ViewOneMemberDetails /></PrivateRoute>} />
            <Route path="/edit_member_details/:member_id" element={<PrivateRoute><UpdateProjectMemberDetails /></PrivateRoute>} />



            <Route path="/add_member" element={<PrivateRoute><AddMember /></PrivateRoute>} />
            <Route path="/onestudentleadforsupervisor/:user_id" element={<PrivateRoute><StudentLeadForSupervisor /></PrivateRoute>} />
            <Route path="/onestudentlead/:user_id">
              <Route index element={<PrivateRoute><OneStudentLead /></PrivateRoute>} />
            </Route>
            <Route path="/supervisorone/:user_id" element={<PrivateRoute><OneSupervisor /></PrivateRoute>} />
            {/* chat */}
            <Route path="/chat/:user_id" element={<PrivateRoute><Chat /></PrivateRoute>} />

            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* landing page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;