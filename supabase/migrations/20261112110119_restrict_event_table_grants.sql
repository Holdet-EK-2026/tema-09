revoke all privileges on public.events, public.event_admins from anon, authenticated;
grant select on public.events, public.event_admins to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
-- event_admins has only a self-read RLS policy; no anon rows are visible.
-- Its SELECT grant is required by the existing events read policy's membership subquery.
-- No client role receives TRUNCATE, REFERENCES, TRIGGER, or admin-membership writes.
