import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import JobCard from '../components/JobCard'

export default function CandidateHome() {
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      let q = supabase.from('jobs').select('*').order('created_at', { ascending: false })
      if (query) q = q.ilike('description', `%${query}%`)
      const { data } = await q
      setJobs(data || [])
      setLoading(false)
    }
    load()
  }, [query])

  return (
    <main>
      <h1>Find jobs</h1>
      <input
        type="search"
        placeholder="Search by keyword..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="card-list">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </main>
  )
}
