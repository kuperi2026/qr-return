alter table public.chat_messages
  add column if not exists edited_at timestamptz;

drop function if exists public.owner_get_all_chat_threads();
create function public.owner_get_all_chat_threads()
returns table(profile_id text, tag_code text, item_name text, item_type text, pet_type text, finder_session text, last_message text, last_message_at timestamptz, finder_last_active timestamptz, message_count bigint)
language sql security definer set search_path = ''
as $$
  select i.id::text, i.tag_code::text, i.item_name::text, i.item_type::text, i.pet_type::text,
    cm.finder_session::text,
    (array_agg(cm.message_text order by cm.created_at desc))[1]::text,
    max(cm.created_at),
    max(cm.created_at) filter (where cm.sender_role = 'finder'),
    count(*)::bigint
  from public.chat_messages cm
  join public.item i on i.id = cm.item_id
  where auth.uid() is not null and i.owner_id = auth.uid()
  group by i.id, i.tag_code, i.item_name, i.item_type, i.pet_type, cm.finder_session
  order by max(cm.created_at) desc;
$$;

drop function if exists public.owner_get_chat_messages_v2(text, text);
create function public.owner_get_chat_messages_v2(p_profile_id text, p_finder_session text)
returns table(id bigint, sender_role text, message_text text, created_at timestamptz, read_at timestamptz, edited_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;
  update public.chat_messages cm set read_at = coalesce(cm.read_at, now())
  from public.item i
  where cm.item_id = i.id and i.owner_id = auth.uid() and i.id::text = p_profile_id
    and cm.finder_session = p_finder_session and cm.sender_role = 'finder' and cm.read_at is null;
  return query
  select cm.id, cm.sender_role, cm.message_text, cm.created_at, cm.read_at, cm.edited_at
  from public.chat_messages cm join public.item i on i.id = cm.item_id
  where i.owner_id = auth.uid() and i.id::text = p_profile_id and cm.finder_session = p_finder_session
  order by cm.created_at asc;
end;
$$;

create or replace function public.owner_edit_chat_message(p_message_id bigint, p_message text)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;
  if nullif(trim(p_message), '') is null or char_length(trim(p_message)) > 2000 then raise exception 'Invalid message.'; end if;
  update public.chat_messages cm set message_text = trim(p_message), message = trim(p_message), edited_at = now()
  from public.item i
  where cm.id = p_message_id and cm.item_id = i.id and i.owner_id = auth.uid()
    and cm.sender_role = 'owner' and cm.sender_user_id = auth.uid();
  if not found then raise exception 'Message not found or access denied.'; end if;
end;
$$;

create or replace function public.owner_delete_chat_thread(p_profile_id text, p_finder_session text)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;
  delete from public.chat_messages cm using public.item i
  where cm.item_id = i.id and i.owner_id = auth.uid() and i.id::text = p_profile_id
    and cm.finder_session = p_finder_session;
end;
$$;

revoke all on function public.owner_get_all_chat_threads() from public, anon;
revoke all on function public.owner_get_chat_messages_v2(text, text) from public, anon;
revoke all on function public.owner_edit_chat_message(bigint, text) from public, anon;
revoke all on function public.owner_delete_chat_thread(text, text) from public, anon;
grant execute on function public.owner_get_all_chat_threads() to authenticated;
grant execute on function public.owner_get_chat_messages_v2(text, text) to authenticated;
grant execute on function public.owner_edit_chat_message(bigint, text) to authenticated;
grant execute on function public.owner_delete_chat_thread(text, text) to authenticated;
