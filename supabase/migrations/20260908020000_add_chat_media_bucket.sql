insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-media',
  'chat-media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "chat media upload" on storage.objects;
create policy "chat media upload"
on storage.objects for insert
to anon, authenticated
with check (
  bucket_id = 'chat-media'
  and array_length(storage.foldername(name), 1) >= 2
);

drop policy if exists "chat media delete own upload" on storage.objects;
create policy "chat media delete own upload"
on storage.objects for delete
to authenticated
using (bucket_id = 'chat-media' and owner_id = (select auth.uid()::text));
