import { Link } from 'react-router-dom'

export default function JobCard({ job }) {
  return (
    <div className="card">
      <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
      <p>{job.location} &middot; {job.work_mode}</p>
      <p>{job.required_experience} yr{job.required_experience !== 1 ? 's' : ''} exp &middot; {job.required_education}</p>
      {job.required_skills?.length > 0 && (
        <p className="skills">{job.required_skills.join(', ')}</p>
      )}
    </div>
  )
}
