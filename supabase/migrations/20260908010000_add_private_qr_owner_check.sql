-- Return only whether the authenticated caller owns this exact QR.
-- The owner's UUID never leaves the database.
create or replace function public.is_qr_owner(p_tag_code text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.qr_inventory q
      where upper(q.tag_code) = upper(trim(p_tag_code))
        and q.owner_id = (select auth.uid())
        and q.status = 'claimed'
    );
$$;

revoke all on function public.is_qr_owner(text) from public, anon;
grant execute on function public.is_qr_owner(text) to authenticated;
