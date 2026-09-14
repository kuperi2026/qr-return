create extension if not exists pg_cron with schema extensions;

create or replace function public.enqueue_notification_push()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare v_secret text;
begin
  select value into v_secret from public.push_config where key = 'push_webhook_secret';
  perform net.http_post(
    url := 'https://abnztmhujczxzaevyvtr.supabase.co/functions/v1/push-chat-notification',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', v_secret),
    body := jsonb_build_object('notification_id', new.id)
  );
  return new;
end;
$$;
revoke all on function public.enqueue_notification_push() from public, anon, authenticated;

drop trigger if exists trg_push_notification on public.notifications;
create trigger trg_push_notification
after insert on public.notifications
for each row execute function public.enqueue_notification_push();

create or replace function public.notify_new_order()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.user_id is not null then
    insert into public.notifications(user_id,type,title,message,order_id,metadata)
    values (
      new.user_id,
      'order',
      'შეკვეთა მიღებულია',
      'თქვენი შეკვეთა წარმატებით დაფიქსირდა.',
      new.id,
      jsonb_build_object('status', new.status, 'event', 'order_created')
    );
  end if;
  return new;
end;
$$;
revoke all on function public.notify_new_order() from public, anon, authenticated;

drop trigger if exists trg_notify_new_order on public.orders;
create trigger trg_notify_new_order
after insert on public.orders
for each row execute function public.notify_new_order();

create or replace function public.notify_owner_on_support_message()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare v_owner uuid;
begin
  if coalesce(new.sender_type, '') not in ('admin','support','company','system') then return new; end if;
  select owner_id into v_owner from public.item where tag_code = new.tag_code limit 1;
  if v_owner is not null then
    insert into public.notifications(user_id,type,title,message,metadata)
    values (v_owner,'chat','KOMPASI მხარდაჭერა',coalesce(nullif(new.message,''),'ახალი შეტყობინება მიიღეთ.'),jsonb_build_object('tag_code',new.tag_code,'event','support_message'));
  end if;
  return new;
end;
$$;
revoke all on function public.notify_owner_on_support_message() from public, anon, authenticated;

drop trigger if exists trg_notify_owner_on_support_message on public.live_chat_messages;
create trigger trg_notify_owner_on_support_message
after insert on public.live_chat_messages
for each row execute function public.notify_owner_on_support_message();

create or replace function public.create_expiry_notifications()
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.notifications(user_id,type,title,message,metadata)
  select
    i.owner_id,
    'expiry',
    'მომსახურების ვადა იწურება',
    'პროფილის „' || coalesce(nullif(i.item_name,''), i.tag_code) || '“ მომსახურების ვადა ' ||
      greatest(1, ceil(extract(epoch from (coalesce(i.service_expires_at,i.trial_ends_at) - now())) / 86400))::int || ' დღეში იწურება.',
    jsonb_build_object('item_id',i.id,'tag_code',i.tag_code,'expires_at',coalesce(i.service_expires_at,i.trial_ends_at),'reminder_key',i.id::text || ':' || coalesce(i.service_expires_at,i.trial_ends_at)::date::text)
  from public.item i
  where i.owner_id is not null
    and coalesce(i.service_expires_at,i.trial_ends_at) > now()
    and coalesce(i.service_expires_at,i.trial_ends_at) <= now() + interval '7 days'
    and not exists (
      select 1 from public.notifications n
      where n.user_id=i.owner_id and n.type='expiry'
        and n.metadata->>'reminder_key'=i.id::text || ':' || coalesce(i.service_expires_at,i.trial_ends_at)::date::text
    );
end;
$$;
revoke all on function public.create_expiry_notifications() from public, anon, authenticated;
grant execute on function public.create_expiry_notifications() to service_role;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname='kompasi-expiry-reminders' limit 1;
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule('kompasi-expiry-reminders','0 13 * * *','select public.create_expiry_notifications()');
end $$;
