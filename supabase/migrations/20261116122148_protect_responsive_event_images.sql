alter policy event_images_admin_delete_unused on storage.objects
using (
  bucket_id = 'event-images'
  and exists (select 1 from public.event_admins where user_id = (select auth.uid()))
  and not exists (
    select 1 from public.events
    where image_url like '%/storage/v1/object/public/event-images/' || storage.objects.name
      or details @> jsonb_build_object(
        'imageSources', jsonb_build_array(jsonb_build_object(
          'url', 'https://oyeubpmrlstczpkgnftt.supabase.co/storage/v1/object/public/event-images/' || storage.objects.name
        ))
      )
  )
);
