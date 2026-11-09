import { verifiedLumaEvents } from "./luma-events.js";
// Eksempelindhold fra de aktive Figma-frames, ikke annoncerede, bookbare events.
const eventData = [
  {
    slug: "design-og-nye-forbindelser",
    title: "Design & nye forbindelser",
    type: "Meetup",
    day: 12,
    month: "november",
    date: "2026-11-12",
    time: "18.00–21.00",
    start: "18:00",
    end: "21:00",
    image: "ca544",
    detailImage: "3c8b7",
    description: "Et uformelt meetup med plads til nye ansigter.",
    frame: "753:951",
  },
  {
    slug: "ideer-paa-papir",
    title: "Idéer på papir",
    type: "Workshop",
    day: 19,
    month: "november",
    date: "2026-11-19",
    time: "17.30–20.30",
    start: "17:30",
    end: "20:30",
    image: "3c8b7",
    detailImage: "3c8b7",
    description: "Udforsk idéer sammen med andre kreative.",
    frame: "753:1492",
  },
  {
    slug: "design-i-virkeligheden",
    title: "Design i virkeligheden",
    type: "Talk",
    day: 26,
    month: "november",
    date: "2026-11-26",
    time: "18.00–21.00",
    start: "18:00",
    end: "21:00",
    image: "c149a",
    detailImage: "c149a",
    description: "Perspektiver fra det kreative arbejdsliv.",
    frame: "753:1540",
  },
  {
    slug: "et-bord-nye-ansigter",
    title: "Et bord, nye ansigter",
    type: "Meetup",
    day: 3,
    month: "december",
    date: "2026-12-03",
    time: "18.00–21.00",
    start: "18:00",
    end: "21:00",
    image: "3c8b7",
    detailImage: "3c8b7",
    description:
      "Mød andre kreative, del det, du er optaget af, og vær nysgerrig på hinandens perspektiver.",
    frame: "753:1588",
  },
];
export function getEventStatus(event, now = Date.now()) {
  if (event.isDemo) return "demo";
  return new Date(event.endAt).getTime() <= now ? "past" : "upcoming";
}
export function eventDateParts(iso, timezone) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date(iso))
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value]),
  );
}
export function formatEventDate(iso, timezone) {
  return new Intl.DateTimeFormat("da-DK", {
    timeZone: timezone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
const clock = (iso, timezone) =>
  new Intl.DateTimeFormat("da-DK", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
export const demoEvents = eventData.map((event) => ({
  ...event,
  isDemo: true,
  status: "demo",
  lumaUrl: null,
}));
export const officialEvents = verifiedLumaEvents
  .map((event) => {
    const parts = eventDateParts(event.startAt, event.timezone);
    return {
      ...event,
      isDemo: false,
      status: getEventStatus(event),
      date: `${parts.year}-${parts.month}-${parts.day}`,
      day: Number(parts.day),
      year: parts.year,
      month: new Intl.DateTimeFormat("da-DK", {
        month: "long",
        timeZone: event.timezone,
      }).format(new Date(event.startAt)),
      monthShort: new Intl.DateTimeFormat("da-DK", {
        month: "short",
        timeZone: event.timezone,
      })
        .format(new Date(event.startAt))
        .replace(".", "")
        .toUpperCase(),
      dateLabel: formatEventDate(event.startAt, event.timezone),
      time:
        clock(event.startAt, event.timezone) +
        (event.endTimeUnclear ? "" : "–" + clock(event.endAt, event.timezone)),
    };
  })
  .sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
export const events = [...officialEvents, ...demoEvents];
export const listedEvents = officialEvents;
export const nextEvent = officialEvents
  .filter((event) => event.status === "upcoming")
  .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))[0];
