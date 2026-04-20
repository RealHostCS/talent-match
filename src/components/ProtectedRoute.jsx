import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children, allowedRole }) {
  const [state, setState] = useState({ loading: true, user: null, role: null })

  useEffect(() => {
    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setState({ loading: false, user: null, role: null })
          return
        }
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setState({ loading: false, user, role: profileError ? null : (profile?.role ?? null) })
      } catch {
        setState({ loading: false, user: null, role: null })
      }
    }
    check()
  }, [])

  if (state.loading) return <main><p>Loading...</p></main>
  if (!state.user || !state.role) return <Navigate to="/login" replace />
  if (allowedRole && state.role !== allowedRole) {
    return <Navigate to={state.role === 'employer' ? '/candidates' : '/jobs'} replace />
  }
  return children
}
