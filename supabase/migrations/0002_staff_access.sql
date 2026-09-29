-- Lets admins give or remove admin-area access from the website.
create or replace function public.grant_staff_access(p_email text, p_role text default 'editor')
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user auth.users%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Only admins can give access.';
  end if;
  if p_role not in ('admin', 'editor') then
    raise exception 'Role must be admin or editor.';
  end if;
  select * into v_user from auth.users where lower(email) = lower(trim(p_email));
  if not found then
    return 'not_found';
  end if;
  insert into public.admin_users (user_id, email, role)
  values (v_user.id, v_user.email, p_role)
  on conflict (user_id) do update set role = excluded.role, email = excluded.email;
  return 'ok';
end;
$$;

create or replace function public.remove_staff_access(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can remove access.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot remove your own access.';
  end if;
  delete from public.admin_users where user_id = p_user_id;
end;
$$;

revoke execute on function public.grant_staff_access(text, text) from public, anon;
revoke execute on function public.remove_staff_access(uuid) from public, anon;
grant execute on function public.grant_staff_access(text, text) to authenticated;
grant execute on function public.remove_staff_access(uuid) to authenticated;

select 'Team access functions installed.' as result;
