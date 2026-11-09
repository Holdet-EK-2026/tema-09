import {officialEvents} from '../../data/events.js';
import {eventCalendar} from '../../lib/calendar.js';
export function getStaticPaths(){return officialEvents.filter(event=>event.status==='upcoming').map(event=>({params:{slug:event.slug},props:{event}}));}
export function GET({props}){return new Response(eventCalendar(props.event),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':`attachment; filename="${props.event.slug}.ics"`}});}
