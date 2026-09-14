create extension if not exists pg_net with schema extensions;

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon;
grant select, insert, update, delete on public.push_subscriptions to authenticated;

create policy "Users manage own push subscriptions"
on public.push_subscriptions
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create table if not exists public.push_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.push_config enable row level security;
revoke all on public.push_config from public, anon, authenticated;
grant select on public.push_config to service_role;

-- Runtime VAPID credentials are provisioned directly in the protected
-- push_config table and are intentionally never committed to source control.
create or replace function public.get_push_config()
returns table(vapid_public_key text, vapid_private_key text, push_webhook_secret text)
language sql
security definer
set search_path = pg_catalog, public
as $$
  select
    max(value) filter (where key = 'vapid_public_key'),
    max(value) filter (where key = 'vapid_private_key'),
    max(value) filter (where key = 'push_webhook_secret')
  from public.push_config;
$$;

revoke all on function public.get_push_config() from public, anon, authenticated;
grant execute on function public.get_push_config() to service_role;

create or replace function public.notify_owner_push_on_chat_message()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_secret text;
begin
  if coalesce(new.sender_role, '') <> 'finder' then
    return new;
  end if;

  select value into v_secret from public.push_config where key = 'push_webhook_secret';

  perform net.http_post(
    url := 'https://abnztmhujczxzaevyvtr.supabase.co/functions/v1/push-chat-notification',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', v_secret),
    body := jsonb_build_object('message_id', new.id)
  );

  return new;
end;
$$;

revoke all on function public.notify_owner_push_on_chat_message() from public, anon, authenticated;

drop trigger if exists trg_owner_push_on_chat_message on public.chat_messages;
create trigger trg_owner_push_on_chat_message
after insert on public.chat_messages
for each row execute function public.notify_owner_push_on_chat_message();
