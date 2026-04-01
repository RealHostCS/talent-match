import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function EmployerProfile() {
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyInfo, setCompanyInfo] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, contact')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name)
        setContact(profile.contact)
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

  if (loading) return <main><p>Loading...</p></main>

  return (
    <main>
      <h1>Company profile</h1>
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
          Company name
          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
        </label>
        <label>
          About the company
          <textarea value={companyInfo} onChange={e => setCompanyInfo(e.target.value)} rows={4} />
        </label>
        {error && <p className="error">{error}</p>}
        {saved && <p className="success">Saved.</p>}
        <button type="submit">Save</button>
      </form>
    </main>
  )
}
