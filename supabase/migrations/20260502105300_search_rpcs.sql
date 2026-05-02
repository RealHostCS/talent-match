create extension if not exists pg_trgm;

create or replace function search_jobs(
  p_query text default '',
  p_work_mode text default '',
  p_location text default ''
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
  created_at timestamptz
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
    j.created_at
  from public.jobs j
  left join public.companies c on c.id = j.employer_id
  where
    (
      p_query = ''
      or j.title ilike '%' || p_query || '%'
      or j.description ilike '%' || p_query || '%'
      or j.location ilike '%' || p_query || '%'
      or c.company_name ilike '%' || p_query || '%'
      or exists (select 1 from unnest(j.required_skills) s where s ilike '%' || p_query || '%')
      or word_similarity(p_query, j.title) > 0.3
      or word_similarity(p_query, j.description) > 0.3
    )
    and (p_work_mode = '' or j.work_mode = p_work_mode)
    and (p_location = '' or j.location ilike '%' || p_location || '%')
  order by j.created_at desc;
$$;

create or replace function search_candidates(
  p_query text default '',
  p_skill text default '',
  p_education text default '',
  p_min_experience int default 0,
  p_work_mode text default '',
  p_location text default ''
)
returns table (
  id uuid,
  education text,
  field_of_study text,
  years_experience int,
  skills text[],
  work_experience text,
  preferred_work_mode text,
  preferred_location text,
  full_name text
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
    p.full_name
  from public.candidates c
  join public.profiles p on p.id = c.id
  where
    (
      p_query = ''
      or p.full_name ilike '%' || p_query || '%'
      or c.education ilike '%' || p_query || '%'
      or c.field_of_study ilike '%' || p_query || '%'
      or c.work_experience ilike '%' || p_query || '%'
      or c.preferred_location ilike '%' || p_query || '%'
      or exists (select 1 from unnest(c.skills) s where s ilike '%' || p_query || '%')
      or word_similarity(p_query, p.full_name) > 0.3
      or word_similarity(p_query, c.field_of_study) > 0.3
    )
    and (p_skill = '' or c.skills @> array[p_skill])
    and (p_education = '' or c.education ilike '%' || p_education || '%')
    and (p_min_experience = 0 or c.years_experience >= p_min_experience)
    and (p_work_mode = '' or c.preferred_work_mode = p_work_mode)
    and (p_location = '' or c.preferred_location ilike '%' || p_location || '%')
  order by c.id;
$$;
