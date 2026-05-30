import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

      if (jobData) {
        setJob(jobData)
        const { data: companyData } = await supabase
          .from('companies')
          .select('company_name, company_info')
          .eq('id', jobData.employer_id)
          .single()
        setCompany(companyData)
      }

      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <main><p>Loading...</p></main>
  if (!job) return <main><p>Job not found.</p></main>

  const salaryRange = [job.salary_min, job.salary_max]
    .filter(value => value !== null && value !== undefined)
    .map(value => `$${Number(value).toLocaleString()}`)
    .join(' - ')

  return (
    <main>
      <h1>{job.title}</h1>
      {company && <p className="subtitle">{company.company_name}</p>}
      <p>{job.location} | {job.work_mode}{job.job_type ? ` | ${job.job_type}` : ''}</p>
      <p>{job.required_experience} yr{job.required_experience !== 1 ? 's' : ''} experience required | {job.required_education}</p>
      {salaryRange && <p><strong>Salary:</strong> {salaryRange}</p>}
      {job.required_skills?.length > 0 && (
        <p><strong>Skills:</strong> {job.required_skills.join(', ')}</p>
      )}
      <h2>Description</h2>
      <p>{job.description}</p>
      {company?.company_info && (
        <>
          <h2>About the company</h2>
          <p>{company.company_info}</p>
        </>
      )}
    </main>
  )
}
