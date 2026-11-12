import { databaseClient } from "./supabase.js";
import { toDisplayEvent } from "../data/events.js";
export function displayRow(row) {
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
    legacyCover: row.details?.id === row.id,
  });
}
export async function publishedEvents(clientFactory = databaseClient) {
  try {
    const { data, error } = await clientFactory()
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("starts_at", { ascending: false })
      .abortSignal(AbortSignal.timeout(6000));
    if (error) throw error;
    return { events: data.map(displayRow), error: null };
  } catch {
    return {
      events: [],
      error:
        "Events kunne ikke hentes. Prøv igen om lidt, eller se KindDesign på Luma.",
    };
  }
}
