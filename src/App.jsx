import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
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

function RootRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    async function redirect() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login', { replace: true }); return }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'employer') {
        navigate('/candidates', { replace: true })
      } else if (profile?.role === 'candidate') {
        navigate('/jobs', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
    redirect()
  }, [navigate])
  return <main><p>Loading...</p></main>
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={
          <ProtectedRoute allowedRole="candidate">
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
          <ProtectedRoute>
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
