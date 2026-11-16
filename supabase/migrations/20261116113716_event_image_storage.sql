-- Public event photography; uploads, listing and cleanup require approved admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp']);

create policy event_images_admin_read on storage.objects for select to authenticated
using (bucket_id = 'event-images' and exists (
  select 1 from public.event_admins where user_id = (select auth.uid())
));

create policy event_images_admin_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'event-images'
  and name ~ '^events/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
  and exists (select 1 from public.event_admins where user_id = (select auth.uid()))
);

-- No UPDATE policy: every upload has a new UUID; existing photos cannot be overwritten.
-- Cleanup cannot remove a photo still referenced by a published OR draft event.
create policy event_images_admin_delete_unused on storage.objects for delete to authenticated
using (
  bucket_id = 'event-images'
  and exists (select 1 from public.event_admins where user_id = (select auth.uid()))
  and not exists (
    select 1 from public.events
    where image_url like '%/storage/v1/object/public/event-images/' || storage.objects.name
  )
);
