import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CandidateProfile() {
  const [education, setEducation] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [skills, setSkills] = useState('')
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
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

      const { data: candidate } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', user.id)
        .single()

      if (candidate) {
        setEducation(candidate.education)
        setFieldOfStudy(candidate.field_of_study)
        setYearsExperience(String(candidate.years_experience))
        setSkills(candidate.skills.join(', '))
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

    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean)

    const { error: candidateError } = await supabase
      .from('candidates')
      .upsert({
        id: user.id,
        education,
        field_of_study: fieldOfStudy,
        years_experience: yearsExperience === '' ? 0 : parseInt(yearsExperience, 10),
        skills: skillsArray,
      })

    if (candidateError) {
      setError(candidateError.message)
      return
    }

    setSaved(true)
  }

  if (loading) return <main><p>Loading...</p></main>

  return (
    <main>
      <h1>My profile</h1>
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
          Education level
          <input type="text" value={education} onChange={e => setEducation(e.target.value)} required />
        </label>
        <label>
          Field of study
          <input type="text" value={fieldOfStudy} onChange={e => setFieldOfStudy(e.target.value)} required />
        </label>
        <label>
          Years of experience
          <input type="number" min="0" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} required />
        </label>
        <label>
          Skills (comma-separated)
          <input type="text" value={skills} onChange={e => setSkills(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        {saved && <p className="success">Saved.</p>}
        <button type="submit">Save</button>
      </form>
    </main>
  )
}
