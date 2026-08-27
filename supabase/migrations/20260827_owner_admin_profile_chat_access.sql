drop policy if exists "owner manages admin profile access" on public.owner_admin_profile_access;
drop policy if exists "admin views assigned profile access" on public.owner_admin_profile_access;

create policy "owner or admin views profile access"
on public.owner_admin_profile_access
for select
to authenticated
using (
  (select auth.uid()) = owner_id
  or exists (
    select 1 from public.owner_admins oa
    where oa.id = owner_admin_id
      and oa.admin_user_id = (select auth.uid())
      and oa.active = true
  )
);

create policy "owner inserts admin profile access"
on public.owner_admin_profile_access
for insert
to authenticated
with check (
  (select auth.uid()) = owner_id
  and exists (select 1 from public.owner_admins oa where oa.id = owner_admin_id and oa.owner_id = (select auth.uid()))
  and exists (select 1 from public.item i where i.id = item_id and i.owner_id = (select auth.uid()))
);

create policy "owner updates admin profile access"
on public.owner_admin_profile_access
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check (
  (select auth.uid()) = owner_id
  and exists (select 1 from public.owner_admins oa where oa.id = owner_admin_id and oa.owner_id = (select auth.uid()))
  and exists (select 1 from public.item i where i.id = item_id and i.owner_id = (select auth.uid()))
);

create policy "owner deletes admin profile access"
on public.owner_admin_profile_access
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create or replace function public.admin_get_chat_messages(p_profile_id text, p_finder_session text)
returns table(id bigint, sender_role text, message_text text, created_at timestamptz)
language sql
security definer
set search_path = ''
as $$
  select cm.id, cm.sender_role, cm.message_text, cm.created_at
  from public.chat_messages cm
  join public.item i on i.id = cm.item_id
  where i.id::text = p_profile_id
    and cm.finder_session = p_finder_session
    and exists (
      select 1
      from public.owner_admins oa
      join public.owner_admin_profile_access apa on apa.owner_admin_id = oa.id
      where oa.owner_id = i.owner_id
        and oa.admin_user_id = auth.uid()
        and oa.active = true
        and oa.can_use_live_chat = true
        and apa.item_id = i.id
        and apa.can_use_live_chat = true
    )
  order by cm.created_at asc;
$$;

create or replace function public.admin_get_chat_threads(p_profile_id text)
returns table(finder_session text, last_message text, last_message_at timestamptz, message_count bigint)
language sql
security definer
set search_path = ''
as $$
  select cm.finder_session,
    (array_agg(cm.message_text order by cm.created_at desc))[1] as last_message,
    max(cm.created_at) as last_message_at,
    count(*) as message_count
  from public.chat_messages cm
  join public.item i on i.id = cm.item_id
  where i.id::text = p_profile_id
    and exists (
      select 1
      from public.owner_admins oa
      join public.owner_admin_profile_access apa on apa.owner_admin_id = oa.id
      where oa.owner_id = i.owner_id
        and oa.admin_user_id = auth.uid()
        and oa.active = true
        and oa.can_use_live_chat = true
        and apa.item_id = i.id
        and apa.can_use_live_chat = true
    )
  group by cm.finder_session
  order by max(cm.created_at) desc;
$$;

create or replace function public.admin_send_chat_message(p_profile_id text, p_finder_session text, p_message text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_item public.item%rowtype;
  new_message_id bigint;
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;
  if nullif(trim(p_finder_session), '') is null then raise exception 'Finder session required.'; end if;
  if nullif(trim(p_message), '') is null then raise exception 'Message cannot be empty.'; end if;
  if length(trim(p_message)) > 2000 then raise exception 'Message is too long.'; end if;

  select * into target_item from public.item where id::text = p_profile_id limit 1;
  if target_item.id is null then raise exception 'Profile not found.'; end if;

  if not exists (
    select 1
    from public.owner_admins oa
    join public.owner_admin_profile_access apa on apa.owner_admin_id = oa.id
    where oa.owner_id = target_item.owner_id
      and oa.admin_user_id = auth.uid()
      and oa.active = true
      and oa.can_use_live_chat = true
      and apa.item_id = target_item.id
      and apa.can_use_live_chat = true
  ) then raise exception 'Permission denied.'; end if;

  if not exists (
    select 1 from public.chat_messages cm
    where cm.item_id = target_item.id and cm.finder_session = p_finder_session
  ) then raise exception 'Chat conversation not found.'; end if;

  insert into public.chat_messages (item_id, tag_code, finder_session, sender_role, sender_user_id, message_text)
  values (target_item.id, target_item.tag_code, p_finder_session, 'admin', auth.uid(), trim(p_message))
  returning id into new_message_id;
  return new_message_id;
end;
$$;

revoke all on function public.admin_get_chat_messages(text, text) from public, anon;
revoke all on function public.admin_get_chat_threads(text) from public, anon;
revoke all on function public.admin_send_chat_message(text, text, text) from public, anon;
grant execute on function public.admin_get_chat_messages(text, text) to authenticated;
grant execute on function public.admin_get_chat_threads(text) to authenticated;
grant execute on function public.admin_send_chat_message(text, text, text) to authenticated;
