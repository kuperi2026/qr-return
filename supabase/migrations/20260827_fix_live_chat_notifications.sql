create or replace function public.notify_owner_on_finder_chat()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid;
  v_tag_code text;
begin
  if new.sender_role is distinct from 'finder' or new.item_id is null then
    return new;
  end if;

  select i.owner_id, i.tag_code
    into v_owner_id, v_tag_code
  from public.item i
  where i.id = new.item_id
  limit 1;

  if v_owner_id is null then
    return new;
  end if;

  insert into public.notifications (
    user_id,
    type,
    title,
    message,
    read,
    metadata
  )
  values (
    v_owner_id,
    'chat',
    'New Live Chat Message',
    coalesce(new.message_text, new.message, 'A finder sent you a new message.'),
    false,
    jsonb_build_object(
      'source', 'finder_chat',
      'item_id', new.item_id,
      'tag_code', v_tag_code,
      'finder_session', new.finder_session
    )
  );

  return new;
exception
  when others then
    raise warning 'QR RETURN chat notification error: %', sqlerrm;
    return new;
end;
$$;

revoke all on function public.notify_owner_on_finder_chat() from public;
