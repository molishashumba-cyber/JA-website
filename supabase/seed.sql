-- Starter content for the JA Zambia website. Safe to run more than once:
-- it only adds rows that don't exist yet and never overwrites your edits.

insert into public.settings (key, value) values
  ('site', '{"name":"Junior Achievement Zambia","tagline":"The Future Starts Here","email":"info@jazambia.org","phone":"","address":"Lusaka, Zambia","social":[{"label":"Facebook","url":"https://www.facebook.com/"},{"label":"Instagram","url":"https://www.instagram.com/"},{"label":"LinkedIn","url":"https://www.linkedin.com/"}]}'::jsonb),
  ('home', '{"hero":{"eyebrow":"Junior Achievement Zambia","title":"The Future Starts Here","text":"We equip young Zambians with the skills and mindset to manage money, launch businesses and lead in their communities.","photo":{"src":"/photos/student-smiling.jpg","alt":"A smiling JA Zambia student in school uniform"}},"milestone":{"title":"500,000 students. 20 years in Zambia.","text":"Two decades of classrooms, camps, competitions and mentors, and we are just getting started."},"feature":{"eyebrow":"Girls LEAD Camp","title":"When girls lead, communities rise","text":"Our Girls LEAD Camp brings young women together with female role models from business and public life to build confidence, leadership and career ambition.","photo":{"src":"/photos/girls-lead-camp.jpg","alt":"Mentors and girls in Girls LEAD t-shirts at the LEAD Camp"}}}'::jsonb)
on conflict (key) do nothing;

insert into public.stats (value, label, sort_order)
select * from (values
  ('500,000+', 'Students reached', 0),
  ('20', 'Years in Zambia', 1),
  ('9', 'Hands-on programs', 2),
  ('100+', 'Countries in the JA network', 3)
) as v(value, label, sort_order)
where not exists (select 1 from public.stats);

insert into public.programs (slug, name, audience, summary, accent, photo_url, photo_alt, sort_order) values
  ('cha-ching', 'Cha-Ching', 'Primary school', 'Fun cartoons and activities that teach children to earn, save, spend and donate wisely.', 'lime', '/photos/cha-ching-reader.jpg', 'A pupil reading a Cha-Ching comic book in class', 0),
  ('company-program', 'JA Company Program', 'Secondary school', 'Students set up and run a real business, from idea and sales to closing the books.', 'teal', '/photos/students-group.jpg', 'A group of JA Zambia students in school uniforms', 1),
  ('company-of-the-year', 'Company of the Year', 'Company Program teams', 'The national competition where the best student companies pitch to judges for the top prize.', 'aqua', '/photos/coy-stage.jpg', 'Students presenting on stage at Company of the Year', 2),
  ('girls-lead-camp', 'Girls LEAD Camp', 'Young women', 'A leadership camp that connects girls with inspiring women role models and mentors.', 'jade', '/photos/girls-lead-camp.jpg', 'Girls LEAD Camp participants', 3),
  ('job-shadows', 'Job Shadows', 'Secondary school', 'Students spend a day in a real workplace to explore careers and see skills in action.', 'azure', null, '', 4),
  ('innovation-camps', 'Innovation Camps', 'Youth', 'Fast-paced challenges where teams solve a real business problem and pitch their idea.', 'yellow', null, '', 5),
  ('its-tyme', 'Its-Tyme', 'Youth', 'Program description to be supplied by the JA Zambia team.', 'teal', null, '', 6),
  ('ja-deep', 'JA Deep', 'Youth', 'Program description to be supplied by the JA Zambia team.', 'lime', null, '', 7),
  ('social-equity', 'Social Equity', 'Youth', 'Program description to be supplied by the JA Zambia team.', 'aqua', null, '', 8)
on conflict (slug) do nothing;

-- Sample news posts are added as drafts (not visible on the site) so they
-- can be used as examples in the admin area.
insert into public.news_posts (slug, title, excerpt, category, photo_url, photo_alt, published_at) values
  ('girls-lead-camp-highlights', 'Highlights from this year''s Girls LEAD Camp', 'Mentors, role models and big ambitions: a look back at our leadership camp for young women.', 'Events', '/photos/girls-lead-camp.jpg', 'Girls LEAD Camp mentors and participants', null),
  ('student-companies-take-flight', 'Student companies take flight', 'Company Program teams from across Lusaka prepare their businesses for the national stage.', 'Programs', '/photos/students-group.jpg', 'JA Zambia students standing together', null),
  ('meet-the-team', 'Meet the people behind JA Zambia', 'Our staff and board share why they believe in the future of Zambia''s young people.', 'Our team', '/photos/team-and-board.jpg', 'JA Zambia staff and board members', null)
on conflict (slug) do nothing;

