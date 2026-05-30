import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PostJob() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requiredEducation, setRequiredEducation] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [requiredExperience, setRequiredExperience] = useState('')
  const [jobType, setJobType] = useState('Full-time')
  const [workMode, setWorkMode] = useState('On-site')
  const [location, setLocation] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean)

    const { data, error: insertError } = await supabase
      .from('jobs')
      .insert({
        employer_id: user.id,
        title,
        description,
        required_education: requiredEducation,
        required_skills: skillsArray,
        required_experience: parseInt(requiredExperience, 10),
        job_type: jobType,
        work_mode: workMode,
        location,
        salary_min: salaryMin === '' ? null : parseInt(salaryMin, 10),
        salary_max: salaryMax === '' ? null : parseInt(salaryMax, 10),
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    if (!data) {
      setError('Failed to create job posting.')
      setLoading(false)
      return
    }
    navigate(`/jobs/${data.id}`)
  }

  return (
    <main>
      <h1>Post a job</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Job title
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} required />
        </label>
        <label>
          Required education
          <input type="text" value={requiredEducation} onChange={e => setRequiredEducation(e.target.value)} required />
        </label>
        <label>
          Required skills (comma-separated)
          <input type="text" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} />
        </label>
        <label>
          Required experience (years)
          <input type="number" min="0" value={requiredExperience} onChange={e => setRequiredExperience(e.target.value)} required />
        </label>
        <label>
          Job type
          <select value={jobType} onChange={e => setJobType(e.target.value)}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </label>
        <label>
          Work mode
          <select value={workMode} onChange={e => setWorkMode(e.target.value)}>
            <option>Remote</option>
            <option>On-site</option>
            <option>Hybrid</option>
          </select>
        </label>
        <label>
          Location
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} required />
        </label>
        <label>
          Minimum salary
          <input type="number" min="0" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} />
        </label>
        <label>
          Maximum salary
          <input type="number" min="0" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post job'}</button>
      </form>
    </main>
  )
}
