import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TeacherInbox from "./pages/TeacherInbox";
import StudentHome from "./pages/StudentHome";
import SubmitResponse from "./pages/SubmitResponse";
import SubmitFeedback from "./pages/SubmitFeedback";
import ResponseInfo from './pages/ResponseInfo';
import Register from "./pages/Register";
import Login from "./pages/Login";
import CourseAdmin from "./pages/CourseAdmin";
import ClassAdmin from "./pages/ClassAdmin";
import JoinClass from "./pages/JoinClass";

function AppContent() {

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-inbox" element={<TeacherInbox />} />
        <Route path="/student-home/:inviteCode" element={<StudentHome />} />
        <Route path="/submit-response" element={<SubmitResponse />} />
        <Route path="/teacher-response/:id" element={<SubmitFeedback />} /> {/* ← when clicking from TeacherInbox */}
        <Route path="/student-response/:id" element={<ResponseInfo />} />
        <Route path="/course-admin" element={<CourseAdmin />} />
        <Route path="/class/:classId" element={<ClassAdmin />} />
        <Route path="/join-class/:inviteCode?" element={<JoinClass />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
