create table public.candidates (
  id uuid primary key references public.profiles(id) on delete cascade,
  education text not null,
  field_of_study text not null,
  years_experience int not null check (years_experience >= 0),
  skills text[] not null default '{}'
);

alter table public.candidates enable row level security;

create policy "authenticated users can read candidates"
  on public.candidates for select
  to authenticated
  using (true);

create policy "candidates can insert own record"
  on public.candidates for insert
  to authenticated
  with check (auth.uid() = id);

create policy "candidates can update own record"
  on public.candidates for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table public.companies (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  company_info text
);

alter table public.companies enable row level security;

create policy "authenticated users can read companies"
  on public.companies for select
  to authenticated
  using (true);

create policy "employers can insert own company"
  on public.companies for insert
  to authenticated
  with check (auth.uid() = id);

create policy "employers can update own company"
  on public.companies for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
