import { Link } from 'react-router-dom'

export default function JobCard({ job }) {
  const salaryRange = [job.salary_min, job.salary_max]
    .filter(value => value !== null && value !== undefined)
    .map(value => `$${Number(value).toLocaleString()}`)
    .join(' - ')

  return (
    <div className="card">
      <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
      <p>{job.location} | {job.work_mode}{job.job_type ? ` | ${job.job_type}` : ''}</p>
      <p>{job.required_experience} yr{job.required_experience !== 1 ? 's' : ''} exp | {job.required_education}</p>
      {salaryRange && <p>{salaryRange}</p>}
      {job.score !== undefined && <p>Match score: {job.score}%</p>}
      {job.required_skills?.length > 0 && (
        <p className="skills">{job.required_skills.join(', ')}</p>
      )}
    </div>
  )
}
