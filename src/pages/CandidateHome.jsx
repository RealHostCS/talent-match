import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import JobCard from '../components/JobCard'

export default function CandidateHome() {
  const [recommended, setRecommended] = useState([])
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [jobType, setJobType] = useState('')
  const [location, setLocation] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_member')
        .eq('id', user.id)
        .single()

      const limit = profile?.is_member ? 2147483647 : 10

      const [recResult, searchResult] = await Promise.all([
        supabase.rpc('recommend_jobs_for_candidate', { candidate_id: user.id, p_limit: limit }),
        supabase.rpc('search_jobs', { p_query: '', p_work_mode: '', p_location: '', p_job_type: '', p_salary_min: 0, p_salary_max: 0 }),
      ])

      setRecommended(recResult.error ? [] : (recResult.data || []))
      setJobs(searchResult.data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    async function search() {
      const { data } = await supabase.rpc('search_jobs', {
        p_query: query,
        p_work_mode: workMode,
        p_location: location,
        p_job_type: jobType,
        p_salary_min: salaryMin === '' ? 0 : parseInt(salaryMin, 10),
        p_salary_max: salaryMax === '' ? 0 : parseInt(salaryMax, 10),
      })
      setJobs(data || [])
    }
    search()
  }, [query, workMode, location, jobType, salaryMin, salaryMax])

  if (loading) return <main><p>Loading...</p></main>

  const locationCount = new Set(jobs.map(job => job.location).filter(Boolean)).size
  const remoteCount = jobs.filter(job => job.work_mode === 'Remote').length
  const fullTimeCount = jobs.filter(job => job.job_type === 'Full-time').length

  return (
    <main className="dashboard">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Candidate workspace</p>
          <h1>Explore jobs</h1>
        </div>
        <div className="metric-grid">
          <div className="metric">
            <span>{jobs.length}</span>
            <p>Open jobs</p>
          </div>
          <div className="metric">
            <span>{recommended.length}</span>
            <p>Recommended</p>
          </div>
          <div className="metric">
            <span>{locationCount}</span>
            <p>Locations</p>
          </div>
          <div className="metric">
            <span>{remoteCount}</span>
            <p>Remote roles</p>
          </div>
          <div className="metric">
            <span>{fullTimeCount}</span>
            <p>Full-time</p>
          </div>
        </div>
      </section>
      {recommended.length > 0 && (
        <section className="content-section">
          <div className="section-head">
            <h2>Recommended for you</h2>
            <span>{recommended.length} matches</span>
          </div>
          <div className="card-list">
            {recommended.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
      )}
      <section className="content-section">
        <div className="section-head">
          <h2>All jobs</h2>
          <span>{jobs.length} results</span>
        </div>
        <div className="filters">
          <input
            type="search"
            placeholder="Search by keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select value={workMode} onChange={e => setWorkMode(e.target.value)}>
            <option value="">All work modes</option>
            <option>Remote</option>
            <option>On-site</option>
            <option>Hybrid</option>
          </select>
          <select value={jobType} onChange={e => setJobType(e.target.value)}>
            <option value="">All job types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Min salary..."
            value={salaryMin}
            onChange={e => setSalaryMin(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Max salary..."
            value={salaryMax}
            onChange={e => setSalaryMax(e.target.value)}
          />
        </div>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="card-list">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </section>
    </main>
  )
}
