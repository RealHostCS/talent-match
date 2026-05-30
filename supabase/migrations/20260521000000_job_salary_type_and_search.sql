alter table public.jobs
  add column if not exists job_type text not null default 'Full-time'
    check (job_type in ('Full-time', 'Part-time', 'Internship', 'Contract')),
  add column if not exists salary_min int check (salary_min is null or salary_min >= 0),
  add column if not exists salary_max int check (salary_max is null or salary_max >= 0);

drop function if exists public.recommend_jobs_for_candidate(uuid, int);

create or replace function recommend_jobs_for_candidate(candidate_id uuid, p_limit int default 10)
returns table (
  id uuid,
  employer_id uuid,
  title text,
  description text,
  required_education text,
  required_skills text[],
  required_experience int,
  work_mode text,
  location text,
  created_at timestamptz,
  job_type text,
  salary_min int,
  salary_max int,
  score int
)
language sql
as $$
  select
    j.id,
    j.employer_id,
    j.title,
    j.description,
    j.required_education,
    j.required_skills,
    j.required_experience,
    j.work_mode,
    j.location,
    j.created_at,
    j.job_type,
    j.salary_min,
    j.salary_max,
    (
      coalesce(
        array_length(
          array(
            select unnest(j.required_skills)
            intersect
            select unnest(c.skills)
          ),
          1
        ),
        0
      ) * 3
      + case when c.years_experience >= j.required_experience then 2 else 0 end
      + case when lower(c.education) = lower(j.required_education) then 1 else 0 end
      + case when c.preferred_work_mode = j.work_mode then 2 else 0 end
      + case when c.preferred_location != '' and j.location ilike '%' || c.preferred_location || '%' then 1 else 0 end
    ) as score
  from public.jobs j
  cross join public.candidates c
  where c.id = candidate_id
  order by score desc, j.created_at desc
  limit p_limit;
$$;

create or replace function search_jobs(
  p_query text default '',
  p_work_mode text default '',
  p_location text default '',
  p_job_type text default '',
  p_salary_min int default 0,
  p_salary_max int default 0
)
returns table (
  id uuid,
  employer_id uuid,
  title text,
  description text,
  required_education text,
  required_skills text[],
  required_experience int,
  work_mode text,
  location text,
  created_at timestamptz,
  job_type text,
  salary_min int,
  salary_max int
)
language sql
as $$
  select distinct
    j.id,
    j.employer_id,
    j.title,
    j.description,
    j.required_education,
    j.required_skills,
    j.required_experience,
    j.work_mode,
    j.location,
    j.created_at,
    j.job_type,
    j.salary_min,
    j.salary_max
  from public.jobs j
  left join public.companies c on c.id = j.employer_id
  where
    (
      p_query = ''
      or j.title ilike '%' || p_query || '%'
      or j.description ilike '%' || p_query || '%'
      or j.location ilike '%' || p_query || '%'
      or j.job_type ilike '%' || p_query || '%'
      or c.company_name ilike '%' || p_query || '%'
      or c.company_info ilike '%' || p_query || '%'
      or exists (select 1 from unnest(j.required_skills) s where s ilike '%' || p_query || '%')
      or word_similarity(p_query, j.title) > 0.3
      or word_similarity(p_query, j.description) > 0.3
      or word_similarity(p_query, coalesce(c.company_name, '')) > 0.3
    )
    and (p_work_mode = '' or j.work_mode = p_work_mode)
    and (p_location = '' or j.location ilike '%' || p_location || '%')
    and (p_job_type = '' or j.job_type = p_job_type)
    and (p_salary_min = 0 or j.salary_max is null or j.salary_max >= p_salary_min)
    and (p_salary_max = 0 or j.salary_min is null or j.salary_min <= p_salary_max)
  order by j.created_at desc;
$$;
