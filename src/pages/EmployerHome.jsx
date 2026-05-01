import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CandidateCard from '../components/CandidateCard'

export default function EmployerHome() {
  const [recommended, setRecommended] = useState([])
  const [candidates, setCandidates] = useState([])
  const [nameSearch, setNameSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [educationFilter, setEducationFilter] = useState('')
  const [minExperience, setMinExperience] = useState('')
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
          const ids = recData.map(r => r.id)
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', ids)

          const profileMap = {}
          profiles?.forEach(p => { profileMap[p.id] = p })

          setRecommended(recData.map(r => ({ ...r, profiles: profileMap[r.id] })))
        }
      }
    }
    loadRecommended()
  }, [])

  useEffect(() => {
    async function load() {
      let q = supabase
        .from('candidates')
        .select('*, profiles(full_name)')
        .order('id')

      if (skillFilter) q = q.contains('skills', [skillFilter.trim()])
      if (educationFilter) q = q.ilike('education', `%${educationFilter}%`)
      if (minExperience !== '') q = q.gte('years_experience', parseInt(minExperience, 10))

      const { data } = await q
      let results = data || []

      if (nameSearch) {
        const lower = nameSearch.toLowerCase()
        results = results.filter(c => c.profiles?.full_name?.toLowerCase().includes(lower))
      }

      setCandidates(results)
      setLoading(false)
    }
    load()
  }, [nameSearch, skillFilter, educationFilter, minExperience])

  return (
    <main>
      {recommended.length > 0 && (
        <section>
          <h2>Recommended candidates</h2>
          <div className="card-list">
            {recommended.map(c => <CandidateCard key={c.id} candidate={c} />)}
          </div>
        </section>
      )}
      <section>
        <h2>All candidates</h2>
        <div className="filters">
          <input type="search" placeholder="Search by name..." value={nameSearch} onChange={e => setNameSearch(e.target.value)} />
          <input type="text" placeholder="Filter by skill..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} />
          <input type="text" placeholder="Filter by education..." value={educationFilter} onChange={e => setEducationFilter(e.target.value)} />
          <input type="number" min="0" placeholder="Min years exp..." value={minExperience} onChange={e => setMinExperience(e.target.value)} />
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
