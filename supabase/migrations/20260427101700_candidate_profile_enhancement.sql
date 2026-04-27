alter table public.candidates
  add column if not exists work_experience text not null default '',
  add column if not exists preferred_work_mode text check (preferred_work_mode in ('Remote', 'On-site', 'Hybrid')),
  add column if not exists preferred_location text not null default '';
