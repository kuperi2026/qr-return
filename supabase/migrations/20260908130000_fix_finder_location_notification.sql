create or replace function public.share_finder_location_v2(
  p_tag_code text,
  p_finder_session text,
  p_latitude double precision,
  p_longitude double precision,
  p_accuracy double precision
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_item public.item%rowtype;
  map_url text;
  location_message text;
begin
  if nullif(trim(p_tag_code), '') is null then raise exception 'QR code required.'; end if;
  if nullif(trim(p_finder_session), '') is null or length(trim(p_finder_session)) > 200 then raise exception 'Finder session required.'; end if;
  if p_latitude is null or p_latitude < -90 or p_latitude > 90
     or p_longitude is null or p_longitude < -180 or p_longitude > 180
     or p_accuracy is null or p_accuracy < 0 or p_accuracy > 10000 then
    raise exception 'Invalid location coordinates.';
  end if;

  select i.* into target_item
  from public.item i
  where lower(i.tag_code) = lower(trim(p_tag_code))
    and coalesce(i.active, false) = true
    and coalesce(i.location_sharing_enabled, false) = true
  limit 1;

  if target_item.id is null then return false; end if;

  update public.item
  set last_scan_latitude = p_latitude,
      last_scan_longitude = p_longitude,
      last_scan_accuracy = p_accuracy,
      last_scanned_at = now(),
      scan_count = coalesce(scan_count, 0) + 1
  where id = target_item.id;

  map_url := 'https://www.google.com/maps?q=' || p_latitude::text || ',' || p_longitude::text;
  location_message := '📍 მპოვნელმა გააზიარა მდებარეობა: ' || map_url;

  insert into public.chat_messages (item_id, tag_code, finder_session, sender_role, sender_user_id, message_text)
  values (target_item.id, target_item.tag_code, trim(p_finder_session), 'finder', null, location_message);

  if target_item.owner_id is not null then
    insert into public.notifications (user_id, type, title, message, read, metadata)
    values (
      target_item.owner_id,
      'location',
      'მპოვნელმა მდებარეობა გააზიარა',
      coalesce(target_item.item_name, 'QR პროფილი') || ' — გახსენით მდებარეობა რუკაზე.',
      false,
      jsonb_build_object(
        'source','finder_location','item_id',target_item.id,'tag_code',target_item.tag_code,
        'finder_session',trim(p_finder_session),'latitude',p_latitude,'longitude',p_longitude,
        'accuracy',p_accuracy,'map_url',map_url
      )
    );
  end if;

  return true;
end;
$$;

revoke all on function public.share_finder_location_v2(text,text,double precision,double precision,double precision) from public;
grant execute on function public.share_finder_location_v2(text,text,double precision,double precision,double precision) to anon, authenticated;
