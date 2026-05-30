import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName, contact },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!data.session) {
      setError('Account created. Please check your email to confirm before signing in.')
      setLoading(false)
      return
    }

    if (role === 'employer') {
      navigate('/employer-profile')
    } else {
      navigate('/profile')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </label>
          <label>
            Contact
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </label>
          <fieldset>
            <legend>I am a</legend>
            <label>
              <input type="radio" name="role" value="candidate" checked={role === 'candidate'} onChange={() => setRole('candidate')} />
              Candidate
            </label>
            <label>
              <input type="radio" name="role" value="employer" checked={role === 'employer'} onChange={() => setRole('employer')} />
              Employer
            </label>
          </fieldset>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}
