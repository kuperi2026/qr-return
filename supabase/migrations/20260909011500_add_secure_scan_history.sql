-- Persist each QR scan and allow owners to read the history of their own profiles.

drop function if exists public.record_qr_scan(uuid, text);
drop function if exists public.record_qr_scan(bigint, text);

create function public.record_qr_scan(p_item_id bigint, p_tag_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item public.item%rowtype;
begin
  select i.* into v_item
  from public.item i
  where i.id = p_item_id
    and lower(i.tag_code) = lower(trim(p_tag_code))
    and i.item_type <> 'emergency'
    and coalesce(i.active, false) = true
  limit 1;

  if v_item.id is null then
    raise exception 'QR profile not found';
  end if;

  update public.item
  set scan_count = coalesce(scan_count, 0) + 1,
      last_scanned_at = now()
  where id = v_item.id;

  insert into public.scan_events (item_id, location_shared)
  values (v_item.id, false);

  if v_item.owner_id is not null then
    insert into public.notifications (user_id, type, title, message, item_id, read, metadata)
    values (
      v_item.owner_id,
      'scan',
      'QR კოდი დასკანირდა',
      coalesce(v_item.item_name, 'QR პროფილი') || ' — დაფიქსირდა ახალი სკანირება.',
      v_item.id,
      false,
      jsonb_build_object('tag_code', v_item.tag_code, 'profile_type', v_item.item_type, 'event', 'scan')
    );
  end if;
end;
$$;

revoke all on function public.record_qr_scan(bigint, text) from public;
grant execute on function public.record_qr_scan(bigint, text) to anon, authenticated;

drop policy if exists "owners read own scan history" on public.scan_events;
create policy "owners read own scan history"
on public.scan_events
for select
to authenticated
using (
  exists (
    select 1
    from public.item i
    where i.id = scan_events.item_id
      and i.owner_id = (select auth.uid())
  )
);

grant select on public.scan_events to authenticated;
