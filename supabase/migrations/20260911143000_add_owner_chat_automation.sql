create table if not exists public.owner_chat_automation (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  welcome_message text not null default 'მოგესალმებით! ახლა შეიძლება მაშინვე ვერ გიპასუხოთ. გთხოვთ, მოკლედ მომწეროთ რა იპოვეთ და სად — პასუხს მალე დაგიბრუნებთ.',
  updated_at timestamptz not null default now(),
  constraint owner_chat_automation_message_length check (char_length(welcome_message) between 10 and 500)
);

alter table public.owner_chat_automation enable row level security;

drop policy if exists "Owners manage chat automation" on public.owner_chat_automation;
create policy "Owners manage chat automation"
on public.owner_chat_automation for all to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create or replace function public.owner_get_chat_automation()
returns table(enabled boolean, welcome_message text)
language sql
security definer
set search_path = ''
as $$
  select coalesce(a.enabled, false),
         coalesce(a.welcome_message, 'მოგესალმებით! ახლა შეიძლება მაშინვე ვერ გიპასუხოთ. გთხოვთ, მოკლედ მომწეროთ რა იპოვეთ და სად — პასუხს მალე დაგიბრუნებთ.')
  from (select auth.uid() as owner_id) u
  left join public.owner_chat_automation a on a.owner_id = u.owner_id
  where u.owner_id is not null;
$$;

create or replace function public.owner_update_chat_automation(p_enabled boolean, p_welcome_message text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_message text := trim(coalesce(p_welcome_message, ''));
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;
  if char_length(v_message) not between 10 and 500 then raise exception 'Message must be 10–500 characters.'; end if;
  insert into public.owner_chat_automation(owner_id, enabled, welcome_message, updated_at)
  values(auth.uid(), coalesce(p_enabled, false), v_message, now())
  on conflict(owner_id) do update set enabled=excluded.enabled, welcome_message=excluded.welcome_message, updated_at=now();
end;
$$;

create or replace function public.send_owner_chat_welcome()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare v_owner uuid; v_enabled boolean; v_message text;
begin
  if new.sender_role is distinct from 'finder' or new.item_id is null or nullif(new.finder_session, '') is null then return new; end if;
  if exists (
    select 1 from public.chat_messages previous
    where previous.item_id = new.item_id and previous.finder_session = new.finder_session
      and previous.sender_role = 'finder' and previous.id <> new.id
  ) then return new; end if;
  select i.owner_id into v_owner from public.item i where i.id = new.item_id;
  select a.enabled, a.welcome_message into v_enabled, v_message
  from public.owner_chat_automation a where a.owner_id = v_owner;
  if coalesce(v_enabled, false) then
    insert into public.chat_messages(item_id, tag_code, finder_session, sender, sender_role, sender_user_id, message, message_text)
    values(new.item_id, new.tag_code, new.finder_session, 'owner', 'owner', v_owner, v_message, v_message);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_owner_chat_welcome on public.chat_messages;
create trigger trg_owner_chat_welcome after insert on public.chat_messages
for each row execute function public.send_owner_chat_welcome();

revoke all on function public.owner_get_chat_automation() from public, anon;
revoke all on function public.owner_update_chat_automation(boolean, text) from public, anon;
revoke all on function public.send_owner_chat_welcome() from public, anon, authenticated;
grant execute on function public.owner_get_chat_automation() to authenticated;
grant execute on function public.owner_update_chat_automation(boolean, text) to authenticated;
