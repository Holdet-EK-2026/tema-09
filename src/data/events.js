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
    lumaKey: "PUBLIC_LUMA_MEETUP_URL",
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
    lumaKey: "PUBLIC_LUMA_WORKSHOP_URL",
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
    lumaKey: "PUBLIC_LUMA_TALK_URL",
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
    lumaKey: "PUBLIC_LUMA_DECEMBER_URL",
  },
];
function verifiedLumaUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      ["lu.ma", "luma.com"].includes(url.hostname) &&
      url.pathname.length > 1 &&
      !url.username &&
      !url.password
    )
      return url.href;
  } catch {
    /* En ugyldig konfiguration må ikke skabe et eksternt link. */
  }
  return null;
}
export const events = eventData.map((event) => ({
  ...event,
  lumaUrl: verifiedLumaUrl(import.meta.env[event.lumaKey]),
}));
export const listedEvents = events.slice(0, 3);
