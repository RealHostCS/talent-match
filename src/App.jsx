import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CandidateProfile from './pages/CandidateProfile'
import EmployerProfile from './pages/EmployerProfile'
import CandidateHome from './pages/CandidateHome'
import EmployerHome from './pages/EmployerHome'
import PostJob from './pages/PostJob'
import JobDetail from './pages/JobDetail'
import CandidateDetail from './pages/CandidateDetail'

export default function App() {
  return (
    <BrowserRouter basename="/talent-match">
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<CandidateProfile />} />
        <Route path="/jobs" element={<CandidateHome />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/candidates" element={<EmployerHome />} />
        <Route path="/candidates/:id" element={<CandidateDetail />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/employer-profile" element={<EmployerProfile />} />
      </Routes>
    </BrowserRouter>
  )
}
