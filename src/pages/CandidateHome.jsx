import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import JobCard from '../components/JobCard'

export default function CandidateHome() {
  const [recommended, setRecommended] = useState([])
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [location, setLocation] = useState('')
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
        supabase.rpc('search_jobs', { p_query: '', p_work_mode: '', p_location: '' }),
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
      })
      setJobs(data || [])
    }
    search()
  }, [query, workMode, location])

  if (loading) return <main><p>Loading...</p></main>

  return (
    <main>
      {recommended.length > 0 && (
        <section>
          <h2>Recommended for you</h2>
          <div className="card-list">
            {recommended.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
      )}
      <section>
        <h2>All jobs</h2>
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
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={e => setLocation(e.target.value)}
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
