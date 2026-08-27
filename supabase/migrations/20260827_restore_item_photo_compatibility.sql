alter table public.item
  add column if not exists photo text;

update public.item
set photo = photo_url
where photo is null and photo_url is not null;

create or replace function private.sync_item_photo_columns()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.photo := coalesce(new.photo, new.photo_url);
    new.photo_url := coalesce(new.photo_url, new.photo);
    return new;
  end if;

  if new.photo is distinct from old.photo
     and new.photo_url is not distinct from old.photo_url then
    new.photo_url := new.photo;
  elsif new.photo_url is distinct from old.photo_url
     and new.photo is not distinct from old.photo then
    new.photo := new.photo_url;
  elsif new.photo is distinct from old.photo
     and new.photo_url is distinct from old.photo_url then
    new.photo_url := new.photo;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_item_photo_columns on public.item;
create trigger sync_item_photo_columns
before insert or update on public.item
for each row execute function private.sync_item_photo_columns();
