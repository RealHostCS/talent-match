import { Link } from 'react-router-dom'

export default function CandidateCard({ candidate }) {
  return (
    <div className="card">
      <h3><Link to={`/candidates/${candidate.id}`}>{candidate.profiles?.full_name || 'Candidate'}</Link></h3>
      <p>{candidate.field_of_study} &middot; {candidate.education}</p>
      <p>{candidate.years_experience} yr{candidate.years_experience !== 1 ? 's' : ''} experience</p>
      {candidate.skills.length > 0 && (
        <p className="skills">{candidate.skills.join(', ')}</p>
      )}
    </div>
  )
}
