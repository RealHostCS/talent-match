alter table public.profiles
  add column if not exists is_member boolean not null default false;

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

create or replace function recommend_candidates_for_job(job_id uuid, p_limit int default 10)
returns table (
  id uuid,
  education text,
  field_of_study text,
  years_experience int,
  skills text[],
  work_experience text,
  preferred_work_mode text,
  preferred_location text,
  score int
)
language sql
as $$
  select
    c.id,
    c.education,
    c.field_of_study,
    c.years_experience,
    c.skills,
    c.work_experience,
    c.preferred_work_mode,
    c.preferred_location,
    (
      coalesce(
        array_length(
          array(
            select unnest(c.skills)
            intersect
            select unnest(j.required_skills)
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
  from public.candidates c
  cross join public.jobs j
  where j.id = job_id
  order by score desc
  limit p_limit;
$$;
