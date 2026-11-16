import { supabaseUrl, supabaseKey } from "./supabase.js";
import { toDisplayEvent } from "../data/events.js";
export function displayRow(row) {
  const legacyCover = row.details?.id === row.id && row.image_url === `/images/luma-${row.id}-1200.webp`;
  const sources = Array.isArray(row.details?.imageSources)
    ? row.details.imageSources.filter(source =>
        source && typeof source.url === "string" && source.url.startsWith(`${supabaseUrl}/storage/v1/object/public/event-images/`) &&
        !/[\s,]/.test(source.url) && Number.isInteger(source.width) && source.width > 0)
    : [];
  const currentSources = sources.some(source => source.url === row.image_url);
  const imageSrcset = currentSources
    ? sources.map(source => `${source.url} ${source.width}w`).join(", ")
    : legacyCover ? `/images/luma-${row.id}-450.webp 450w, /images/luma-${row.id}-600.webp 600w, /images/luma-${row.id}-1200.webp ${row.details?.coverWidth || 1200}w` : undefined;
  return toDisplayEvent({
    ...row.details,
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    type: row.category,
    startAt: row.starts_at,
    endAt: row.ends_at,
    timezone: row.timezone,
    location: row.location,
    city: row.city,
    address: row.address,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    lumaUrl: row.luma_url,
    paragraphs: Array.isArray(row.details?.paragraphs)
      ? row.details.paragraphs.filter((p) => typeof p === "string")
      : [],
    program: Array.isArray(row.details?.program)
      ? row.details.program.filter(
          (p) =>
            Array.isArray(p) &&
            p.length === 2 &&
            p.every((v) => typeof v === "string"),
        )
      : undefined,
    coverWidth: row.details?.coverWidth,
    coverHeight: row.details?.coverHeight,
    legacyCover,
    imageSrcset,
  });
}
export async function publishedEvents(fetcher = fetch) {
  try {
    if (!supabaseUrl || !supabaseKey) throw new Error("Supabase mangler konfiguration.");
    // Same REST/JSON flow as the course PDFs; the publishable key stays in env.
    const endpoint = `${supabaseUrl}/rest/v1/events?select=*&status=eq.published&order=starts_at.desc`;
    const response = await fetcher(endpoint, {
      headers: { apikey: supabaseKey },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error("Eventdatabasen svarede med en fejl.");
    const data = await response.json();
    if (!Array.isArray(data) || data.some(row => row.status !== "published")) throw new Error("Ugyldige eventdata.");
    return { events: data.map(displayRow), error: null };
  } catch {
    return {
      events: [],
      error:
        "Events kunne ikke hentes. Prøv igen om lidt, eller se KindDesign på Luma.",
    };
  }
}
