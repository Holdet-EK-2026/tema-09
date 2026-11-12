alter table public.events add constraint event_image_alt_present check (length(trim(image_alt)) between 1 and 500);
create function public.validate_event_timezone() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if not exists(select 1 from pg_catalog.pg_timezone_names where name = new.timezone) then
  raise exception 'Unknown IANA timezone' using errcode = '22023';
 end if;
 return new;
end;
$$;
revoke all on function public.validate_event_timezone() from public, anon, authenticated;
create trigger validate_event_timezone before insert or update on public.events for each row execute function public.validate_event_timezone();
