import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function EmployerProfile() {
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyInfo, setCompanyInfo] = useState('')
  const [isMember, setIsMember] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, contact, is_member')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name)
        setContact(profile.contact)
        setIsMember(profile.is_member)
      }

      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('id', user.id)
        .single()

      if (company) {
        setCompanyName(company.company_name)
        setCompanyInfo(company.company_info || '')
      }

      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaved(false)

    const { data: { user } } = await supabase.auth.getUser()

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, contact })
      .eq('id', user.id)

    if (profileError) {
      setError(profileError.message)
      return
    }

    const { error: companyError } = await supabase
      .from('companies')
      .upsert({ id: user.id, company_name: companyName, company_info: companyInfo })

    if (companyError) {
      setError(companyError.message)
      return
    }

    setSaved(true)
  }

  async function toggleMembership() {
    const { data: { user } } = await supabase.auth.getUser()
    const next = !isMember
    const { error: memberError } = await supabase
      .from('profiles')
      .update({ is_member: next })
      .eq('id', user.id)
    if (!memberError) setIsMember(next)
  }

  if (loading) return <main><p>Loading...</p></main>

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">Employer profile</p>
          <h1>{companyName || 'Company profile'}</h1>
          <p>Complete your company profile so candidates can understand your organisation and job search can include company information.</p>
        </div>
        <span className={isMember ? 'status-pill active' : 'status-pill'}>{isMember ? 'Member' : 'Free plan'}</span>
      </section>

      <div className="profile-layout">
        <aside className="profile-summary">
          <div className="avatar">{(companyName || fullName || 'E').slice(0, 1).toUpperCase()}</div>
          <h2>{companyName || 'Company name not set'}</h2>
          <p>{fullName || 'Employer contact'}</p>
          <dl>
            <div>
              <dt>Contact</dt>
              <dd>{contact || 'Not set'}</dd>
            </div>
            <div>
              <dt>Profile</dt>
              <dd>{companyInfo ? 'Complete' : 'Needs details'}</dd>
            </div>
            <div>
              <dt>Recommendations</dt>
              <dd>{isMember ? 'Unlimited' : 'Top 10'}</dd>
            </div>
          </dl>
          <section className="membership compact">
            <h2>Membership</h2>
            <p>{isMember ? 'Active - unlimited recommendations' : 'Free - top 10 recommendations'}</p>
            <button type="button" onClick={toggleMembership}>
              {isMember ? 'Cancel membership' : 'Activate membership'}
            </button>
          </section>
        </aside>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section-title">
            <h2>Contact information</h2>
            <p>Details for managing your employer account.</p>
          </div>
          <label>
            Full name
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </label>
          <label>
            Contact
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} required />
          </label>

          <div className="form-section-title wide">
            <h2>Company information</h2>
            <p>This information appears on job detail pages and is included in job search.</p>
          </div>
          <label className="wide">
            Company name
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
          </label>
          <label className="wide">
            About the company
            <textarea value={companyInfo} onChange={e => setCompanyInfo(e.target.value)} rows={4} />
          </label>
          {error && <p className="error wide">{error}</p>}
          {saved && <p className="success wide">Saved.</p>}
          <button type="submit">Save profile</button>
        </form>
      </div>
    </main>
  )
}
