-- One-time: makes the first login created in this Supabase project an admin.
-- Does nothing if an admin already exists. Create your login first
-- (Authentication → Users → Add user), then run this.
insert into public.admin_users (user_id, email, role)
select id, email, 'admin'
from auth.users
where not exists (select 1 from public.admin_users where role = 'admin')
order by created_at
limit 1
on conflict (user_id) do update set role = 'admin';

select email, role from public.admin_users;
