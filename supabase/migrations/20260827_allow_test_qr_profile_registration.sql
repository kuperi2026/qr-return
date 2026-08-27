-- Temporary test mode: permit a signed-in owner to register a unique QR code
-- even when it has not yet been preloaded into qr_tags.
create or replace function public.validate_item_qr_tag()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  qr_row public.qr_tags%rowtype;
  requested_category text;
begin
  requested_category := coalesce(new.pet_type, new.item_type);

  if new.owner_id is null or new.owner_id <> (select auth.uid()) then
    raise exception 'Profile owner does not match authenticated user';
  end if;

  select *
    into qr_row
  from public.qr_tags
  where upper(tag_code) = upper(new.tag_code)
  for update;

  if found then
    if qr_row.status <> 'unassigned'
       or qr_row.assigned_owner_id is not null
       or qr_row.assigned_profile_id is not null
       or qr_row.profile_id is not null then
      raise exception 'QR tag is already activated';
    end if;

    if qr_row.category is not null
       and qr_row.category <> requested_category then
      raise exception 'QR tag category does not match profile category';
    end if;
  end if;

  new.tag_code := upper(trim(new.tag_code));
  return new;
end;
$$;

create or replace function public.activate_item_qr_tag()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.qr_tags
  set
    category = coalesce(new.pet_type, new.item_type),
    status = 'activated',
    profile_id = new.id,
    assigned_owner_id = new.owner_id,
    activated_at = now()
  where upper(tag_code) = upper(new.tag_code)
    and status = 'unassigned'
    and assigned_owner_id is null
    and assigned_profile_id is null
    and profile_id is null;

  -- Missing qr_tags rows are intentionally accepted only during test mode.
  return new;
end;
$$;
