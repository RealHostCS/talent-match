import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CandidateCard from '../components/CandidateCard'

export default function EmployerHome() {
  const [recommended, setRecommended] = useState([])
  const [candidates, setCandidates] = useState([])
  const [query, setQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [educationFilter, setEducationFilter] = useState('')
  const [minExperience, setMinExperience] = useState('')
  const [workModeFilter, setWorkModeFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecommended() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_member')
        .eq('id', user.id)
        .single()

      const limit = profile?.is_member ? 2147483647 : 10

      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (jobs && jobs.length > 0) {
        const { data: recData } = await supabase.rpc('recommend_candidates_for_job', {
          job_id: jobs[0].id,
          p_limit: limit,
        })

        if (recData && recData.length > 0) {
          setRecommended(recData)
        }
      }
    }
    loadRecommended()
  }, [])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.rpc('search_candidates', {
        p_query: query,
        p_skill: skillFilter,
        p_education: educationFilter,
        p_min_experience: minExperience === '' ? 0 : parseInt(minExperience, 10),
        p_work_mode: workModeFilter,
        p_location: locationFilter,
      })
      setCandidates(data || [])
      setLoading(false)
    }
    load()
  }, [query, skillFilter, educationFilter, minExperience, workModeFilter, locationFilter])

  const locationCount = new Set(candidates.map(candidate => candidate.preferred_location).filter(Boolean)).size
  const remoteCount = candidates.filter(candidate => candidate.preferred_work_mode === 'Remote').length
  const experiencedCount = candidates.filter(candidate => candidate.years_experience >= 2).length

  return (
    <main className="dashboard">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>Review candidates</h1>
        </div>
        <div className="metric-grid">
          <div className="metric">
            <span>{candidates.length}</span>
            <p>Candidates</p>
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
            <p>Remote ready</p>
          </div>
          <div className="metric">
            <span>{experiencedCount}</span>
            <p>2+ yrs exp</p>
          </div>
        </div>
      </section>
      {recommended.length > 0 && (
        <section className="content-section">
          <div className="section-head">
            <h2>Recommended candidates</h2>
            <span>{recommended.length} matches</span>
          </div>
          <div className="card-list">
            {recommended.map(c => <CandidateCard key={c.id} candidate={c} />)}
          </div>
        </section>
      )}
      <section className="content-section">
        <div className="section-head">
          <h2>All candidates</h2>
          <span>{candidates.length} results</span>
        </div>
        <div className="filters">
          <input type="search" placeholder="Search by keyword..." value={query} onChange={e => setQuery(e.target.value)} />
          <input type="text" placeholder="Filter by skill..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} />
          <input type="text" placeholder="Filter by education..." value={educationFilter} onChange={e => setEducationFilter(e.target.value)} />
          <input type="number" min="0" placeholder="Min years exp..." value={minExperience} onChange={e => setMinExperience(e.target.value)} />
          <select value={workModeFilter} onChange={e => setWorkModeFilter(e.target.value)}>
            <option value="">All work modes</option>
            <option>Remote</option>
            <option>On-site</option>
            <option>Hybrid</option>
          </select>
          <input type="text" placeholder="Filter by location..." value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : candidates.length === 0 ? (
          <p>No candidates found.</p>
        ) : (
          <div className="card-list">
            {candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
          </div>
        )}
      </section>
    </main>
  )
}
