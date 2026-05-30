import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CandidateDetail() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: candidateData } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single()

      if (candidateData) {
        setCandidate(candidateData)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, contact')
          .eq('id', id)
          .single()
        setProfile(profileData)
      }

      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <main><p>Loading...</p></main>
  if (!candidate) return <main><p>Candidate not found.</p></main>

  return (
    <main>
      <h1>{profile?.full_name || 'Candidate'}</h1>
      <p>Contact: {profile?.contact}</p>
      <p>{candidate.field_of_study} | {candidate.education}</p>
      <p>{candidate.years_experience} yr{candidate.years_experience !== 1 ? 's' : ''} experience</p>
      {candidate.skills?.length > 0 && (
        <p><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
      )}
      {candidate.work_experience && (
        <>
          <h2>Work experience</h2>
          <p>{candidate.work_experience}</p>
        </>
      )}
      {(candidate.preferred_work_mode || candidate.preferred_location) && (
        <p>
          <strong>Preferences:</strong>{' '}
          {[candidate.preferred_work_mode, candidate.preferred_location].filter(Boolean).join(', ')}
        </p>
      )}
    </main>
  )
}
