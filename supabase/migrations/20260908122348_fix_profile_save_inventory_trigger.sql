create or replace function private.sync_item_qr_inventory()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.owner_id is null or new.owner_id <> (select auth.uid()) then
    raise exception 'Profile owner does not match authenticated user';
  end if;

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

revoke all on function private.sync_item_qr_inventory() from public, anon, authenticated;

drop trigger if exists sync_item_qr_inventory_trigger on public.item;
create trigger sync_item_qr_inventory_trigger
after insert on public.item
for each row execute function private.sync_item_qr_inventory();

drop function if exists public.sync_item_qr_inventory();
