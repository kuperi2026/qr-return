create schema if not exists private;

create table if not exists public.emergency_public_profiles (
  tag_code text primary key references public.emergency_profiles(tag_code) on delete cascade,
  first_name text, last_name text, date_of_birth date, sex text, blood_type text,
  allergies text, medical_conditions text, medications text, medical_note text,
  owner_phone text, emergency_contact_name text, emergency_contact_relationship text,
  emergency_contact_phone text, second_contact_name text,
  second_contact_relationship text, second_contact_phone text,
  live_chat_enabled boolean not null default true,
  location_sharing_enabled boolean not null default false,
  missing_mode boolean not null default false, missing_message text,
  active boolean not null default true, updated_at timestamptz not null default now()
);

alter table public.emergency_public_profiles enable row level security;
create policy "public can read active emergency profiles"
on public.emergency_public_profiles for select to anon, authenticated using (active = true);
grant select on public.emergency_public_profiles to anon, authenticated;
revoke insert, update, delete on public.emergency_public_profiles from anon, authenticated;

create or replace function private.sync_emergency_public_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.emergency_public_profiles(
  tag_code,first_name,last_name,date_of_birth,sex,blood_type,allergies,
  medical_conditions,medications,medical_note,owner_phone,
  emergency_contact_name,emergency_contact_relationship,emergency_contact_phone,
  second_contact_name,second_contact_relationship,second_contact_phone,
  live_chat_enabled,location_sharing_enabled,missing_mode,missing_message,active,updated_at
 ) values (
  new.tag_code,case when new.show_name then new.first_name end,
  case when new.show_name then new.last_name end,
  case when new.show_date_of_birth then new.date_of_birth end,
  case when new.show_sex then new.sex end,
  case when new.show_blood_type then new.blood_type end,
  case when new.show_allergies then new.allergies end,
  case when new.show_medical_conditions then new.medical_conditions end,
  case when new.show_medications then new.medications end,
  case when new.show_medical_note then new.medical_note end,
  case when new.show_owner_phone then new.owner_phone end,
  case when new.emergency_contact_enabled and new.show_emergency_contact then new.emergency_contact_name end,
  case when new.emergency_contact_enabled and new.show_emergency_contact then new.emergency_contact_relationship end,
  case when new.emergency_contact_enabled and new.show_emergency_contact then new.emergency_contact_phone end,
  case when new.second_contact_enabled and new.show_second_contact then new.second_contact_name end,
  case when new.second_contact_enabled and new.show_second_contact then new.second_contact_relationship end,
  case when new.second_contact_enabled and new.show_second_contact then new.second_contact_phone end,
  new.live_chat_enabled,new.location_sharing_enabled,new.missing_mode,
  case when new.missing_mode then new.missing_message end,new.active,now()
 ) on conflict(tag_code) do update set
  first_name=excluded.first_name,last_name=excluded.last_name,date_of_birth=excluded.date_of_birth,
  sex=excluded.sex,blood_type=excluded.blood_type,allergies=excluded.allergies,
  medical_conditions=excluded.medical_conditions,medications=excluded.medications,
  medical_note=excluded.medical_note,owner_phone=excluded.owner_phone,
  emergency_contact_name=excluded.emergency_contact_name,
  emergency_contact_relationship=excluded.emergency_contact_relationship,
  emergency_contact_phone=excluded.emergency_contact_phone,
  second_contact_name=excluded.second_contact_name,
  second_contact_relationship=excluded.second_contact_relationship,
  second_contact_phone=excluded.second_contact_phone,
  live_chat_enabled=excluded.live_chat_enabled,
  location_sharing_enabled=excluded.location_sharing_enabled,
  missing_mode=excluded.missing_mode,missing_message=excluded.missing_message,
  active=excluded.active,updated_at=now();
 return new;
end $$;
revoke all on function private.sync_emergency_public_profile() from public;
grant execute on function private.sync_emergency_public_profile() to postgres;

create trigger sync_emergency_public_profile_trigger
after insert or update on public.emergency_profiles
for each row execute function private.sync_emergency_public_profile();

drop policy if exists "finder can read active emergency profiles" on public.emergency_profiles;
create policy "owner can read emergency profiles"
on public.emergency_profiles for select to authenticated
using ((select auth.uid()) = owner_id);
