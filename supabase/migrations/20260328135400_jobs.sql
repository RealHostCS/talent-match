create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  required_education text not null,
  required_skills text[] not null default '{}',
  required_experience int not null check (required_experience >= 0),
  work_mode text not null check (work_mode in ('Remote', 'On-site', 'Hybrid')),
  location text not null,
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "authenticated users can read jobs"
  on public.jobs for select
  to authenticated
  using (true);

create policy "employers can insert own jobs"
  on public.jobs for insert
  to authenticated
  with check (auth.uid() = employer_id);

create policy "employers can update own jobs"
  on public.jobs for update
  to authenticated
  using (auth.uid() = employer_id)
  with check (auth.uid() = employer_id);

create policy "employers can delete own jobs"
  on public.jobs for delete
  to authenticated
  using (auth.uid() = employer_id);
