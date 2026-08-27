drop policy if exists "system admin can read all item profiles" on public.item;
create policy "system admin can read all item profiles"
on public.item for select
to authenticated
using (
  exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid())
  )
);

drop policy if exists "system admin can read all emergency profiles" on public.emergency_profiles;
create policy "system admin can read all emergency profiles"
on public.emergency_profiles for select
to authenticated
using (
  exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid())
  )
);

drop policy if exists "system admin can read all owner accounts" on public.owner_accounts;
create policy "system admin can read all owner accounts"
on public.owner_accounts for select
to authenticated
using (
  exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid())
  )
);
