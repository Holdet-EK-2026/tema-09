begin;
select set_config('kd.test_admin',gen_random_uuid()::text,true);
select set_config('kd.test_event','qa-'||gen_random_uuid()::text,true);
insert into auth.users(id) values(current_setting('kd.test_admin')::uuid);
insert into public.event_admins(user_id) values(current_setting('kd.test_admin')::uuid);
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('kd.test_admin'),'role','authenticated')::text,true);
insert into public.events(id,slug,title,description,category,starts_at,ends_at,timezone,location,city,image_url,image_alt,luma_url,status)
 values(current_setting('kd.test_event'),current_setting('kd.test_event'),'QA event','Transaction-only test','Meetup','2027-01-01T18:00:00Z','2027-01-01T20:00:00Z','Europe/Copenhagen','QA','QA','/images/ca544.webp','QA','https://luma.com/qa','draft');
do $$ begin assert exists(select 1 from public.events where id=current_setting('kd.test_event')); end $$;
set local role anon;
select set_config('request.jwt.claims','{}',true);
do $$ begin
 assert not exists(select 1 from public.events where id=current_setting('kd.test_event')), 'Draft leaked';
 begin
 insert into public.events(id,slug,title,description,category,starts_at,ends_at,timezone,location,city,image_url,image_alt,luma_url)
 values('forbidden','forbidden','Forbidden','Forbidden','Talk',now(),now()+interval '1 hour','UTC','QA','QA','/images/ca544.webp','QA','https://luma.com/qa');
 raise exception 'Anon insert was allowed';
 exception when insufficient_privilege then null; end;
end $$;
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',gen_random_uuid(),'role','authenticated')::text,true);
do $$ declare n int; begin
 update public.events set title='Forbidden' where id=current_setting('kd.test_event');get diagnostics n=row_count;assert n=0;
 begin insert into public.event_admins(user_id) values((auth.uid()));raise exception 'Self elevation allowed';exception when insufficient_privilege then null;end;
 delete from public.events where id=current_setting('kd.test_event');get diagnostics n=row_count;assert n=0;
 begin
 insert into public.events(slug,title,description,category,starts_at,ends_at,timezone,location,city,image_url,image_alt,luma_url)
 values('forbidden-user','Forbidden','Forbidden','Talk',now(),now()+interval '1 hour','UTC','QA','QA','/images/ca544.webp','QA','https://luma.com/qa');
 raise exception 'Non-admin insert was allowed';
 exception when insufficient_privilege then null;end;

end $$;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('kd.test_admin'),'role','authenticated')::text,true);
update public.events set title='QA edited',status='published' where id=current_setting('kd.test_event');
set local role anon;
select set_config('request.jwt.claims','{}',true);
do $$ begin assert exists(select 1 from public.events where id=current_setting('kd.test_event') and title='QA edited');end $$;
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('kd.test_admin'),'role','authenticated')::text,true);
delete from public.events where id=current_setting('kd.test_event');
do $$ begin assert not exists(select 1 from public.events where id=current_setting('kd.test_event'));end $$;
rollback;
select count(*) as retained_events from public.events;
