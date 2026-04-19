import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import JobCard from '../components/JobCard'

export default function CandidateHome() {
  const [recommended, setRecommended] = useState([])
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const [recResult, allResult] = await Promise.all([
        supabase.rpc('recommend_jobs_for_candidate', { candidate_id: user.id }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
      ])

      setRecommended(recResult.error ? [] : (recResult.data || []))
      setJobs(allResult.data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    async function search() {
      let q = supabase.from('jobs').select('*').order('created_at', { ascending: false })
      if (query) q = q.ilike('description', `%${query}%`)
      const { data } = await q
      setJobs(data || [])
    }
    search()
  }, [query])

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
        <input
          type="search"
          placeholder="Search by keyword..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
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
