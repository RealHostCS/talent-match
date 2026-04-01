import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import ProtectedRoute from './components/ProtectedRoute'
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
        <Route path="/profile" element={
          <ProtectedRoute>
            <CandidateProfile />
          </ProtectedRoute>
        } />
        <Route path="/employer-profile" element={
          <ProtectedRoute allowedRole="employer">
            <EmployerProfile />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateHome />
          </ProtectedRoute>
        } />
        <Route path="/jobs/:id" element={
          <ProtectedRoute allowedRole="candidate">
            <JobDetail />
          </ProtectedRoute>
        } />
        <Route path="/candidates" element={
          <ProtectedRoute allowedRole="employer">
            <EmployerHome />
          </ProtectedRoute>
        } />
        <Route path="/candidates/:id" element={
          <ProtectedRoute allowedRole="employer">
            <CandidateDetail />
          </ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute allowedRole="employer">
            <PostJob />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
