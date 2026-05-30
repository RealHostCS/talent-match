do $$
declare
  v_employer_id uuid;
begin
  select id
  into v_employer_id
  from public.profiles
  where role = 'employer'
  order by created_at desc
  limit 1;

  if v_employer_id is null then
    raise exception 'No employer profile found. Please sign up as an employer first.';
  end if;

  insert into public.jobs (
    employer_id,
    title,
    description,
    required_education,
    required_skills,
    required_experience,
    work_mode,
    location,
    job_type,
    salary_min,
    salary_max
  )
  values
    (
      v_employer_id,
      'Junior Software Engineer',
      'Build and maintain web application features using React, JavaScript, and REST APIs. Work with the product team to fix bugs, improve usability, and deliver reliable user-facing functionality.',
      'Bachelor',
      array['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
      1,
      'Hybrid',
      'Sydney',
      'Full-time',
      65000,
      85000
    ),
    (
      v_employer_id,
      'Data Analyst',
      'Analyse business data, prepare dashboards, clean datasets, and present insights to stakeholders. The role requires strong SQL skills and the ability to explain trends clearly.',
      'Bachelor',
      array['SQL', 'Excel', 'Power BI', 'Python', 'Data Analysis'],
      1,
      'Remote',
      'Melbourne',
      'Full-time',
      70000,
      90000
    ),
    (
      v_employer_id,
      'Frontend Developer Intern',
      'Support the frontend team by implementing UI components, writing basic tests, and improving page responsiveness. Suitable for candidates with a portfolio or university projects.',
      'Bachelor',
      array['React', 'JavaScript', 'CSS', 'Figma'],
      0,
      'On-site',
      'Wollongong',
      'Internship',
      35000,
      45000
    ),
    (
      v_employer_id,
      'Backend Developer',
      'Develop server-side APIs, database queries, and authentication workflows. Collaborate with frontend developers to deliver secure and scalable recruitment platform features.',
      'Bachelor',
      array['Node.js', 'PostgreSQL', 'REST API', 'Supabase', 'JavaScript'],
      2,
      'Hybrid',
      'Sydney',
      'Full-time',
      85000,
      115000
    ),
    (
      v_employer_id,
      'Cyber Security Analyst',
      'Monitor system activity, investigate security alerts, document incidents, and help improve access control policies. Good communication and basic networking knowledge are required.',
      'Bachelor',
      array['Cybersecurity', 'Networking', 'Risk Assessment', 'Linux', 'SQL'],
      2,
      'On-site',
      'Canberra',
      'Full-time',
      80000,
      110000
    ),
    (
      v_employer_id,
      'UX UI Designer',
      'Design user flows, wireframes, and polished interface mockups for a recruitment platform. Work closely with developers to improve usability and accessibility.',
      'Bachelor',
      array['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Accessibility'],
      1,
      'Hybrid',
      'Brisbane',
      'Contract',
      60000,
      85000
    ),
    (
      v_employer_id,
      'Cloud Support Engineer',
      'Help customers troubleshoot cloud infrastructure, deployment issues, and database connectivity. This role suits candidates with strong problem-solving skills and cloud fundamentals.',
      'Bachelor',
      array['AWS', 'Linux', 'Networking', 'SQL', 'Troubleshooting'],
      1,
      'Remote',
      'Australia',
      'Full-time',
      75000,
      100000
    ),
    (
      v_employer_id,
      'Machine Learning Assistant',
      'Assist with data preparation, model evaluation, and documentation for machine learning experiments. Candidates should understand Python and basic statistics.',
      'Bachelor',
      array['Python', 'Machine Learning', 'Data Analysis', 'Statistics'],
      1,
      'Hybrid',
      'Melbourne',
      'Part-time',
      50000,
      70000
    ),
    (
      v_employer_id,
      'IT Business Analyst',
      'Gather requirements, write user stories, map workflows, and support communication between business stakeholders and technical teams.',
      'Bachelor',
      array['Requirements Analysis', 'Agile', 'Documentation', 'SQL', 'Communication'],
      2,
      'Hybrid',
      'Sydney',
      'Full-time',
      78000,
      105000
    ),
    (
      v_employer_id,
      'Quality Assurance Tester',
      'Create test cases, run manual testing, report defects, and support release quality for web application features. Automation testing knowledge is a bonus.',
      'Bachelor',
      array['Testing', 'Test Cases', 'Bug Reporting', 'Selenium', 'JavaScript'],
      0,
      'Remote',
      'Perth',
      'Contract',
      55000,
      75000
    );
end $$;
