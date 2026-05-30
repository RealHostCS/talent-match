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
  with scored_jobs as (
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
      least(
        100,
        round(
          (
            case
              when cardinality(j.required_skills) = 0 then 0
              else least(
                coalesce(
                  cardinality(
                    array(
                      select lower(job_skill.skill)
                      from unnest(j.required_skills) as job_skill(skill)
                      intersect
                      select lower(candidate_skill.skill)
                      from unnest(c.skills) as candidate_skill(skill)
                    )
                  ),
                  0
                )::numeric / cardinality(j.required_skills)::numeric,
                1
              ) * 40
            end
            + case when c.years_experience >= j.required_experience then 20 else 0 end
            + case when lower(c.education) = lower(j.required_education) then 15 else 0 end
            + case when c.preferred_work_mode = j.work_mode then 15 else 0 end
            + case
                when c.preferred_location != ''
                 and (
                   j.location ilike '%' || c.preferred_location || '%'
                   or c.preferred_location ilike '%' || j.location || '%'
                 ) then 10
                else 0
              end
          )
        )
      )::int as score
    from public.jobs j
    cross join public.candidates c
    where c.id = candidate_id
  )
  select
    scored_jobs.id,
    scored_jobs.employer_id,
    scored_jobs.title,
    scored_jobs.description,
    scored_jobs.required_education,
    scored_jobs.required_skills,
    scored_jobs.required_experience,
    scored_jobs.work_mode,
    scored_jobs.location,
    scored_jobs.created_at,
    scored_jobs.job_type,
    scored_jobs.salary_min,
    scored_jobs.salary_max,
    scored_jobs.score
  from scored_jobs
  order by scored_jobs.score desc, scored_jobs.created_at desc
  limit p_limit;
$$;

drop function if exists public.recommend_candidates_for_job(uuid, int);

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
  with scored_candidates as (
    select
      c.id,
      c.education,
      c.field_of_study,
      c.years_experience,
      c.skills,
      c.work_experience,
      c.preferred_work_mode,
      c.preferred_location,
      least(
        100,
        round(
          (
            case
              when cardinality(j.required_skills) = 0 then 0
              else least(
                coalesce(
                  cardinality(
                    array(
                      select lower(candidate_skill.skill)
                      from unnest(c.skills) as candidate_skill(skill)
                      intersect
                      select lower(job_skill.skill)
                      from unnest(j.required_skills) as job_skill(skill)
                    )
                  ),
                  0
                )::numeric / cardinality(j.required_skills)::numeric,
                1
              ) * 40
            end
            + case when c.years_experience >= j.required_experience then 20 else 0 end
            + case when lower(c.education) = lower(j.required_education) then 15 else 0 end
            + case when c.preferred_work_mode = j.work_mode then 15 else 0 end
            + case
                when c.preferred_location != ''
                 and (
                   j.location ilike '%' || c.preferred_location || '%'
                   or c.preferred_location ilike '%' || j.location || '%'
                 ) then 10
                else 0
              end
          )
        )
      )::int as score
    from public.candidates c
    cross join public.jobs j
    where j.id = job_id
  )
  select
    scored_candidates.id,
    scored_candidates.education,
    scored_candidates.field_of_study,
    scored_candidates.years_experience,
    scored_candidates.skills,
    scored_candidates.work_experience,
    scored_candidates.preferred_work_mode,
    scored_candidates.preferred_location,
    scored_candidates.score
  from scored_candidates
  order by scored_candidates.score desc
  limit p_limit;
$$;
