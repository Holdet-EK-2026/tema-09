create table public.event_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.event_admins enable row level security;
grant select on public.event_admins to anon, authenticated;
revoke insert, update, delete on public.event_admins from anon, authenticated;
create policy own_admin_membership on public.event_admins for select to authenticated using (user_id = (select auth.uid()));
create table public.events (
 id text primary key default gen_random_uuid()::text,
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check (length(trim(title)) between 1 and 250),
 description text not null check (length(trim(description)) between 1 and 10000),
 category text not null check (category in ('Meetup','Workshop','Talk')),
 starts_at timestamptz not null,
 ends_at timestamptz not null check (ends_at > starts_at),
 timezone text not null,
 location text not null,
 city text not null,
 address text not null default '',
 image_url text not null check (image_url ~ '^(/images/|https://)'),
 image_alt text not null,
 luma_url text not null check (luma_url ~ '^https://luma\.com/[A-Za-z0-9_-]+$'),
 status text not null default 'draft' check (status in ('draft','published')),
 details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index events_public_date on public.events(status, starts_at);
create index events_category_date on public.events(category, starts_at);
alter table public.events enable row level security;
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
create policy read_events on public.events for select to anon, authenticated
 using (status = 'published' or exists(select 1 from public.event_admins where user_id = (select auth.uid())));
create policy admin_insert_events on public.events for insert to authenticated
 with check (exists(select 1 from public.event_admins where user_id = (select auth.uid())));
create policy admin_update_events on public.events for update to authenticated
 using (exists(select 1 from public.event_admins where user_id = (select auth.uid())))
 with check (exists(select 1 from public.event_admins where user_id = (select auth.uid())));
create policy admin_delete_events on public.events for delete to authenticated
 using (exists(select 1 from public.event_admins where user_id = (select auth.uid())));
create function public.events_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function public.events_updated_at() from public, anon, authenticated;
create trigger events_updated_at before update on public.events for each row execute function public.events_updated_at();
