import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CandidateCard from '../components/CandidateCard'

export default function EmployerHome() {
  const [candidates, setCandidates] = useState([])
  const [nameSearch, setNameSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [educationFilter, setEducationFilter] = useState('')
  const [minExperience, setMinExperience] = useState('')
  const [loading, setLoading] = useState(true)

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
      <h1>Find candidates</h1>
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
    </main>
  )
}
