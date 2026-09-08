create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

alter table public.item
  add column if not exists trial_ends_at timestamptz,
  add column if not exists service_expires_at timestamptz,
  add column if not exists service_status text not null default 'trial';

update public.item set trial_ends_at = coalesce(trial_ends_at, created_at + interval '2 months') where trial_ends_at is null;

create or replace function private.set_item_trial_dates() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.trial_ends_at := coalesce(new.trial_ends_at, coalesce(new.created_at, now()) + interval '2 months');
  new.service_status := coalesce(new.service_status, 'trial');
  return new;
end; $$;
drop trigger if exists set_item_trial_dates on public.item;
create trigger set_item_trial_dates before insert on public.item for each row execute function private.set_item_trial_dates();

create table if not exists public.service_activation_requests (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  item_id bigint not null references public.item(id) on delete cascade,
  period_months integer not null check (period_months in (1,3,6,12)), base_amount numeric(10,2) not null check (base_amount >= 0),
  discount_percent integer not null default 0 check (discount_percent in (0,5,10,12,15)), final_amount numeric(10,2) not null check (final_amount >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','rejected','cancelled')),
  requested_at timestamptz not null default now(), confirmed_at timestamptz, service_starts_at timestamptz, service_expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);
create unique index if not exists service_activation_one_pending_per_item on public.service_activation_requests(item_id) where status = 'pending';
alter table public.service_activation_requests enable row level security;
grant select, insert on public.service_activation_requests to authenticated;
grant update(status) on public.service_activation_requests to authenticated;
create policy "owners read own activation requests" on public.service_activation_requests for select to authenticated using ((select auth.uid()) = owner_id);
create policy "owners create own activation requests" on public.service_activation_requests for insert to authenticated with check ((select auth.uid()) = owner_id and exists (select 1 from public.item i where i.id = item_id and i.owner_id = (select auth.uid())));
create policy "admins read activation requests" on public.service_activation_requests for select to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "admins confirm activation requests" on public.service_activation_requests for update to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create or replace function private.notify_service_activation_request() returns trigger language plpgsql security definer set search_path = '' as $$
declare v_item public.item%rowtype; v_period_label text;
begin
  select * into v_item from public.item where id = new.item_id and owner_id = new.owner_id;
  if not found then raise exception 'Profile ownership check failed'; end if;
  v_period_label := case new.period_months when 12 then '1-წლიანი' else new.period_months::text || '-თვიანი' end;
  insert into public.notifications(user_id,type,title,message,metadata) values (new.owner_id,'service','პაკეტის მოთხოვნა მიღებულია',coalesce(v_item.item_name,'QR პროფილი') || '-ის ' || v_period_label || ' პაკეტის მოთხოვნა მიღებულია. დადასტურების შემდეგ პროფილში გამოჩნდება მომსახურების დასრულების თარიღი.',jsonb_build_object('request_id',new.id,'item_id',new.item_id,'tag_code',v_item.tag_code,'status','pending'));
  insert into public.live_chat_messages(profile_type,tag_code,sender_type,sender_session,message) values (coalesce(nullif(v_item.item_type,''),'item'),v_item.tag_code,'system','qr-return-service','თქვენი ' || v_period_label || ' მომსახურების პაკეტის მოთხოვნა მიღებულია. QR RETURN-ის გუნდი დადასტურების შემდეგ გამოგიგზავნით დასრულების თარიღს.');
  return new;
end; $$;
drop trigger if exists notify_service_activation_request on public.service_activation_requests;
create trigger notify_service_activation_request after insert on public.service_activation_requests for each row execute function private.notify_service_activation_request();

create or replace function private.confirm_service_activation() returns trigger language plpgsql security definer set search_path = '' as $$
declare v_item public.item%rowtype; v_start timestamptz; v_end timestamptz; v_period_label text;
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    select * into v_item from public.item where id = new.item_id;
    if not found then raise exception 'Profile not found'; end if;
    v_start := greatest(now(), coalesce(v_item.trial_ends_at, now()));
    v_end := v_start + make_interval(months => new.period_months);
    v_period_label := case new.period_months when 12 then '1-წლიანი' else new.period_months::text || '-თვიანი' end;
    new.confirmed_at := now(); new.service_starts_at := v_start; new.service_expires_at := v_end;
    update public.item set service_status = 'active', service_expires_at = v_end where id = new.item_id and owner_id = new.owner_id;
    insert into public.notifications(user_id,type,title,message,metadata) values (new.owner_id,'service','მომსახურება გააქტიურდა',coalesce(v_item.item_name,'QR პროფილი') || '-ის ' || v_period_label || ' მომსახურება გააქტიურდა და მოქმედებს ' || to_char(v_end at time zone 'Asia/Tbilisi','DD.MM.YYYY') || '-მდე.',jsonb_build_object('request_id',new.id,'item_id',new.item_id,'tag_code',v_item.tag_code,'status','confirmed','expires_at',v_end));
    insert into public.live_chat_messages(profile_type,tag_code,sender_type,sender_session,message) values (coalesce(nullif(v_item.item_type,''),'item'),v_item.tag_code,'system','qr-return-service','თქვენი ' || v_period_label || ' მომსახურება გააქტიურდა. მოქმედების ვადა: ' || to_char(v_end at time zone 'Asia/Tbilisi','DD.MM.YYYY') || '-მდე.');
  end if;
  return new;
end; $$;
drop trigger if exists confirm_service_activation on public.service_activation_requests;
create trigger confirm_service_activation before update of status on public.service_activation_requests for each row execute function private.confirm_service_activation();
