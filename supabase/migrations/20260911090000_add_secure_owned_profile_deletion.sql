create or replace function public.delete_owned_item(p_item_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.item where id = p_item_id and owner_id = auth.uid()
  ) then
    return false;
  end if;

  delete from public.trusted_users where item_id = p_item_id;
  delete from public.scan_events where item_id = p_item_id;
  delete from public.item where id = p_item_id and owner_id = auth.uid();
  return found;
end;
$$;

revoke all on function public.delete_owned_item(bigint) from public, anon;
grant execute on function public.delete_owned_item(bigint) to authenticated;
