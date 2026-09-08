-- Use qr_inventory as the source of truth for physical QR activation.

create or replace function public.get_qr_activation(p_tag_code text)
returns table (
  id uuid,
  tag_code text,
  qr_type text,
  category text,
  status text,
  item_id bigint,
  emergency_profile_id uuid
)
language sql
stable
security definer
set search_path = ''
as $$
  select q.id, q.tag_code, q.qr_type, q.category, q.status,
         q.item_id, q.emergency_profile_id
  from public.qr_inventory q
  where upper(q.tag_code) = upper(trim(p_tag_code))
  limit 1;
$$;

revoke all on function public.get_qr_activation(text) from public;
grant execute on function public.get_qr_activation(text) to anon, authenticated;

create or replace function public.claim_qr_inventory(p_tag_code text)
returns table (
  id uuid,
  tag_code text,
  qr_type text,
  category text,
  status text,
  owner_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null
     or coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) then
    raise exception 'Authentication is required';
  end if;

  return query
  update public.qr_inventory q
  set owner_id = current_user_id,
      status = 'claimed',
      claimed_at = now(),
      updated_at = now()
  where upper(q.tag_code) = upper(trim(p_tag_code))
    and q.status = 'unclaimed'
    and q.owner_id is null
  returning q.id, q.tag_code, q.qr_type, q.category, q.status, q.owner_id;
end;
$$;

revoke all on function public.claim_qr_inventory(text) from public;
grant execute on function public.claim_qr_inventory(text) to authenticated;

create or replace function public.sync_item_qr_inventory()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.qr_inventory
  set item_id = new.id,
      updated_at = now()
  where upper(tag_code) = upper(new.tag_code)
    and status = 'claimed'
    and owner_id = new.owner_id
    and item_id is null;
  return new;
end;
$$;

drop trigger if exists sync_item_qr_inventory_trigger on public.item;
create trigger sync_item_qr_inventory_trigger
after insert on public.item
for each row execute function public.sync_item_qr_inventory();

create or replace function public.sync_emergency_qr_inventory()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.qr_inventory
  set emergency_profile_id = new.id,
      updated_at = now()
  where upper(tag_code) = upper(new.tag_code)
    and status = 'claimed'
    and owner_id = new.owner_id
    and emergency_profile_id is null;
  return new;
end;
$$;

drop trigger if exists sync_emergency_qr_inventory_trigger on public.emergency_profiles;
create trigger sync_emergency_qr_inventory_trigger
after insert on public.emergency_profiles
for each row execute function public.sync_emergency_qr_inventory();
