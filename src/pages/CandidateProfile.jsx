import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CandidateProfile() {
  const [education, setEducation] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [skills, setSkills] = useState('')
  const [workExperience, setWorkExperience] = useState('')
  const [preferredWorkMode, setPreferredWorkMode] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
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
        setWorkExperience(candidate.work_experience || '')
        setPreferredWorkMode(candidate.preferred_work_mode || '')
        setPreferredLocation(candidate.preferred_location || '')
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
        work_experience: workExperience,
        preferred_work_mode: preferredWorkMode || null,
        preferred_location: preferredLocation,
      })

    if (candidateError) {
      setError(candidateError.message)
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

  const skillsList = skills.split(',').map(skill => skill.trim()).filter(Boolean)

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">Candidate profile</p>
          <h1>{fullName || 'My profile'}</h1>
          <p>Keep your profile complete so job recommendations can better match your skills, experience, and preferred location.</p>
        </div>
        <span className={isMember ? 'status-pill active' : 'status-pill'}>{isMember ? 'Member' : 'Free plan'}</span>
      </section>

      <div className="profile-layout">
        <aside className="profile-summary">
          <div className="avatar">{(fullName || 'C').slice(0, 1).toUpperCase()}</div>
          <h2>{fullName || 'Candidate'}</h2>
          <p>{fieldOfStudy || 'Field of study not set'}</p>
          <dl>
            <div>
              <dt>Experience</dt>
              <dd>{yearsExperience || 0} yrs</dd>
            </div>
            <div>
              <dt>Work mode</dt>
              <dd>{preferredWorkMode || 'Flexible'}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{preferredLocation || 'Not set'}</dd>
            </div>
          </dl>
          <div className="skill-cloud">
            {skillsList.length > 0 ? skillsList.slice(0, 8).map(skill => <span key={skill}>{skill}</span>) : <span>No skills added</span>}
          </div>
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
            <h2>Personal information</h2>
            <p>Basic contact details used by employers.</p>
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
            <h2>Candidate details</h2>
            <p>These fields drive the recommendation score.</p>
          </div>
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
            Preferred working mode
            <select value={preferredWorkMode} onChange={e => setPreferredWorkMode(e.target.value)}>
              <option value="">No preference</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </label>
          <label>
            Preferred location
            <input type="text" value={preferredLocation} onChange={e => setPreferredLocation(e.target.value)} />
          </label>
          <label>
            Skills (comma-separated)
            <input type="text" value={skills} onChange={e => setSkills(e.target.value)} />
          </label>
          <label className="wide">
            Work experience
            <textarea value={workExperience} onChange={e => setWorkExperience(e.target.value)} rows={4} />
          </label>
          {error && <p className="error wide">{error}</p>}
          {saved && <p className="success wide">Saved.</p>}
          <button type="submit">Save profile</button>
        </form>
      </div>
    </main>
  )
}
