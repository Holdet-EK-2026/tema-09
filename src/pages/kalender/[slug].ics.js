import {publishedEvents} from '../../lib/event-repository.js';
import {eventCalendar} from '../../lib/calendar.js';
export const prerender=false;
export async function GET({params}){const result=await publishedEvents();if(result.error)return new Response('Kalenderen er midlertidigt utilgængelig.',{status:503});const event=result.events.find(e=>e.slug===params.slug&&e.status==='upcoming');if(!event)return new Response('Kalenderfilen er ikke tilgængelig.',{status:404});return new Response(eventCalendar(event),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':`attachment; filename="${event.slug}.ics"`}});}
