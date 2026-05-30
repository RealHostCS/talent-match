-- Candidate demo seed data.
--
-- Important:
-- candidates.id references public.profiles(id), and profiles.id references auth.users(id).
-- Therefore this script does not create fake auth users. First sign up candidate
-- accounts through the app or Supabase Auth, then run this script in Supabase SQL Editor.
-- It fills existing candidate profiles in created_at order with realistic demo data.

create temp table tmp_demo_candidates (
  rn int primary key,
  full_name text not null,
  contact text not null,
  education text not null,
  field_of_study text not null,
  years_experience int not null,
  skills text[] not null,
  work_experience text not null,
  preferred_work_mode text,
  preferred_location text not null,
  is_member boolean not null
) on commit drop;

insert into tmp_demo_candidates (
  rn,
  full_name,
  contact,
  education,
  field_of_study,
  years_experience,
  skills,
  work_experience,
  preferred_work_mode,
  preferred_location,
  is_member
)
values
  (
    1,
    'Emily Chen',
    'emily.chen@example.com',
    'Bachelor',
    'Marketing',
    2,
    array['Marketing', 'Social Media', 'Content Writing', 'Campaign Planning', 'Communication'],
    'Worked as a marketing assistant for a retail brand, supporting social media calendars, campaign reporting, and email promotions.',
    'Hybrid',
    'Sydney',
    true
  ),
  (
    2,
    'Oliver Smith',
    'oliver.smith@example.com',
    'Diploma',
    'Business Administration',
    3,
    array['Customer Service', 'Retail Sales', 'Team Leadership', 'Stock Management', 'Problem Solving'],
    'Supervised retail floor operations, trained new staff, handled customer concerns, and supported weekly stock control.',
    'On-site',
    'Melbourne',
    false
  ),
  (
    3,
    'Ava Johnson',
    'ava.johnson@example.com',
    'High School',
    'Office Administration',
    1,
    array['Administration', 'Data Entry', 'Microsoft Office', 'Scheduling', 'Communication'],
    'Completed office administration work placement involving reception, document preparation, calendar updates, and data entry.',
    'On-site',
    'Wollongong',
    false
  ),
  (
    4,
    'Noah Williams',
    'noah.williams@example.com',
    'Bachelor',
    'Human Resources',
    2,
    array['Human Resources', 'Recruitment', 'Onboarding', 'Employee Relations', 'Documentation'],
    'Supported recruitment coordination, interview scheduling, onboarding checklists, and employee record maintenance.',
    'Hybrid',
    'Sydney',
    true
  ),
  (
    5,
    'Mia Brown',
    'mia.brown@example.com',
    'Diploma',
    'Education Support',
    1,
    array['Education Support', 'Child Development', 'Classroom Support', 'Patience', 'Communication'],
    'Assisted primary school teachers with reading groups, classroom resources, student supervision, and learning activities.',
    'On-site',
    'Newcastle',
    false
  ),
  (
    6,
    'Lucas Wilson',
    'lucas.wilson@example.com',
    'Diploma',
    'Early Childhood Education',
    2,
    array['Early Childhood Education', 'Child Safety', 'Learning Activities', 'Family Communication', 'Observation'],
    'Worked in an early learning centre planning activities, documenting child development, and communicating with families.',
    'On-site',
    'Brisbane',
    true
  ),
  (
    7,
    'Grace Lee',
    'grace.lee@example.com',
    'Bachelor',
    'Nursing',
    4,
    array['Nursing', 'Patient Care', 'Clinical Documentation', 'Medication Administration', 'Teamwork'],
    'Registered nurse with experience in patient monitoring, care planning, medication rounds, and multidisciplinary teamwork.',
    'On-site',
    'Perth',
    true
  ),
  (
    8,
    'Ethan Martin',
    'ethan.martin@example.com',
    'High School',
    'Health Administration',
    1,
    array['Reception', 'Patient Service', 'Appointment Scheduling', 'Data Entry', 'Confidentiality'],
    'Medical reception experience including appointment booking, patient records, phone enquiries, and front desk support.',
    'On-site',
    'Adelaide',
    false
  ),
  (
    9,
    'Chloe Anderson',
    'chloe.anderson@example.com',
    'Certificate',
    'Dental Assisting',
    1,
    array['Dental Assisting', 'Sterilisation', 'Patient Care', 'Clinical Support', 'Organisation'],
    'Completed dental assisting certificate and supported room preparation, instrument sterilisation, and chairside assistance.',
    'On-site',
    'Sydney',
    false
  ),
  (
    10,
    'Liam Thompson',
    'liam.thompson@example.com',
    'Certificate',
    'Community Services',
    2,
    array['Disability Support', 'Personal Care', 'Community Access', 'Care Notes', 'Empathy'],
    'Supported clients with daily activities, transport, personal goals, and care documentation in community support settings.',
    'On-site',
    'Canberra',
    true
  ),
  (
    11,
    'Sophie Garcia',
    'sophie.garcia@example.com',
    'Bachelor',
    'Accounting',
    3,
    array['Accounting', 'Financial Reporting', 'Reconciliation', 'Excel', 'Budgeting'],
    'Prepared monthly reconciliations, assisted budget tracking, processed invoices, and supported financial reporting.',
    'Hybrid',
    'Melbourne',
    true
  ),
  (
    12,
    'Jack Davis',
    'jack.davis@example.com',
    'Certificate',
    'Bookkeeping',
    2,
    array['Bookkeeping', 'Payroll', 'Invoicing', 'Bank Reconciliation', 'Xero'],
    'Maintained bookkeeping records for small businesses using Xero, including payroll entries, invoices, and bank reconciliation.',
    'Remote',
    'Australia',
    false
  ),
  (
    13,
    'Isabella Rodriguez',
    'isabella.rodriguez@example.com',
    'High School',
    'Customer Service',
    1,
    array['Customer Service', 'Communication', 'Problem Solving', 'CRM', 'Attention to Detail'],
    'Handled customer enquiries through phone, email, and live chat while maintaining accurate CRM records.',
    'Remote',
    'Australia',
    false
  ),
  (
    14,
    'Henry Miller',
    'henry.miller@example.com',
    'High School',
    'Sales',
    3,
    array['Sales', 'Negotiation', 'Customer Relationship', 'Product Knowledge', 'Communication'],
    'Worked in retail and business sales, following up leads, preparing quotes, and maintaining client relationships.',
    'Hybrid',
    'Sydney',
    true
  ),
  (
    15,
    'Charlotte Moore',
    'charlotte.moore@example.com',
    'Bachelor',
    'Graphic Design',
    2,
    array['Graphic Design', 'Adobe Creative Suite', 'Branding', 'Layout Design', 'Creativity'],
    'Designed digital campaign assets, social media graphics, brochures, and presentation templates for small business clients.',
    'Hybrid',
    'Melbourne',
    false
  ),
  (
    16,
    'Benjamin Taylor',
    'benjamin.taylor@example.com',
    'Bachelor',
    'Communications',
    2,
    array['Content Writing', 'Editing', 'Research', 'SEO', 'Communication'],
    'Created blog articles, website copy, newsletters, and SEO content for education and lifestyle brands.',
    'Remote',
    'Australia',
    true
  ),
  (
    17,
    'Amelia White',
    'amelia.white@example.com',
    'Diploma',
    'Event Management',
    3,
    array['Event Planning', 'Supplier Coordination', 'Logistics', 'Budget Tracking', 'Communication'],
    'Coordinated venues, supplier timelines, run sheets, guest lists, and event-day operations for community events.',
    'On-site',
    'Brisbane',
    false
  ),
  (
    18,
    'James Harris',
    'james.harris@example.com',
    'High School',
    'Hospitality',
    1,
    array['Hospitality', 'Guest Service', 'Reservations', 'Communication', 'Problem Solving'],
    'Front desk and guest services experience in a hotel environment, including reservations and check-in support.',
    'On-site',
    'Sydney',
    false
  ),
  (
    19,
    'Ella Clark',
    'ella.clark@example.com',
    'Certificate',
    'Commercial Cookery',
    4,
    array['Cooking', 'Food Safety', 'Kitchen Operations', 'Time Management', 'Teamwork'],
    'Prepared meals in high-volume kitchens, managed a section during service, and followed food safety procedures.',
    'On-site',
    'Melbourne',
    true
  ),
  (
    20,
    'William Lewis',
    'william.lewis@example.com',
    'High School',
    'Warehouse Operations',
    2,
    array['Warehouse Operations', 'Inventory Control', 'Dispatch', 'Forklift', 'Safety'],
    'Worked across receiving, picking, packing, forklift operation, stock checks, and dispatch preparation.',
    'On-site',
    'Perth',
    false
  ),
  (
    21,
    'Harper Walker',
    'harper.walker@example.com',
    'Diploma',
    'Logistics',
    3,
    array['Logistics', 'Transport Planning', 'Scheduling', 'Problem Solving', 'Excel'],
    'Coordinated shipment schedules, delivery tracking, transport provider communication, and logistics reporting.',
    'Hybrid',
    'Adelaide',
    true
  ),
  (
    22,
    'Alexander Hall',
    'alexander.hall@example.com',
    'Bachelor',
    'Civil Engineering',
    1,
    array['Civil Engineering', 'AutoCAD', 'Project Documentation', 'Site Inspection', 'Problem Solving'],
    'Graduate civil engineer with internship experience in site inspections, AutoCAD updates, and infrastructure reports.',
    'Hybrid',
    'Sydney',
    false
  ),
  (
    23,
    'Scarlett Young',
    'scarlett.young@example.com',
    'Bachelor',
    'Environmental Science',
    2,
    array['Environmental Science', 'Compliance', 'Sustainability', 'Reporting', 'Site Assessment'],
    'Supported environmental audits, sustainability reporting, site assessments, and compliance documentation.',
    'Hybrid',
    'Hobart',
    true
  ),
  (
    24,
    'Daniel King',
    'daniel.king@example.com',
    'Diploma',
    'Legal Services',
    1,
    array['Legal Administration', 'Document Preparation', 'Research', 'Client Service', 'Confidentiality'],
    'Assisted with legal filing, client intake, appointment scheduling, document preparation, and confidential records.',
    'On-site',
    'Sydney',
    false
  ),
  (
    25,
    'Lily Wright',
    'lily.wright@example.com',
    'Bachelor',
    'Exercise Science',
    2,
    array['Fitness Training', 'Coaching', 'Program Design', 'Customer Service', 'Motivation'],
    'Designed fitness programs, coached clients, tracked progress, and supported member engagement at a local gym.',
    'On-site',
    'Brisbane',
    false
  );

do $$
declare
  v_candidate_count int;
  v_sample_count int;
begin
  select count(*)
  into v_candidate_count
  from public.profiles
  where role = 'candidate';

  select count(*)
  into v_sample_count
  from tmp_demo_candidates;

  if v_candidate_count = 0 then
    raise exception 'No candidate profiles found. Please sign up candidate accounts first.';
  end if;

  if v_candidate_count < v_sample_count then
    raise notice 'Only % candidate profile(s) found. The script will seed the first % demo candidate(s).',
      v_candidate_count,
      v_candidate_count;
  end if;
end $$;

create temp table tmp_candidate_targets as
select
  id,
  row_number() over (order by created_at, id) as rn
from public.profiles
where role = 'candidate';

update public.profiles p
set
  full_name = d.full_name,
  contact = d.contact,
  is_member = d.is_member
from tmp_candidate_targets t
join tmp_demo_candidates d on d.rn = t.rn
where p.id = t.id;

insert into public.candidates (
  id,
  education,
  field_of_study,
  years_experience,
  skills,
  work_experience,
  preferred_work_mode,
  preferred_location
)
select
  t.id,
  d.education,
  d.field_of_study,
  d.years_experience,
  d.skills,
  d.work_experience,
  d.preferred_work_mode,
  d.preferred_location
from tmp_candidate_targets t
join tmp_demo_candidates d on d.rn = t.rn
on conflict (id) do update
set
  education = excluded.education,
  field_of_study = excluded.field_of_study,
  years_experience = excluded.years_experience,
  skills = excluded.skills,
  work_experience = excluded.work_experience,
  preferred_work_mode = excluded.preferred_work_mode,
  preferred_location = excluded.preferred_location;
