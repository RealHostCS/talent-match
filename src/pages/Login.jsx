import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile) {
      await supabase.auth.signOut()
      setError('Account setup is incomplete. Please sign up again.')
      setLoading(false)
      return
    }

    if (profile.role === 'employer') {
      navigate('/candidates')
    } else {
      navigate('/jobs')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">No account? <Link to="/signup">Sign up</Link></p>
      </section>
    </main>
  )
}
