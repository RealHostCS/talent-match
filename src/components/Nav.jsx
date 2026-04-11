import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Nav() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => setRole(data?.role ?? null))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) { setRole(null); return }
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => setRole(data?.role ?? null))
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav>
      <Link to={role === 'employer' ? '/candidates' : role === 'candidate' ? '/jobs' : '/login'} className="nav-brand">
        Talent Match
      </Link>
      <div className="nav-links">
        {role === 'candidate' && (
          <>
            <Link to="/jobs">Jobs</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
        {role === 'employer' && (
          <>
            <Link to="/candidates">Candidates</Link>
            <Link to="/post-job">Post job</Link>
            <Link to="/employer-profile">Profile</Link>
          </>
        )}
        {role && (
          <button type="button" onClick={handleSignOut}>Sign out</button>
        )}
        {!role && (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
