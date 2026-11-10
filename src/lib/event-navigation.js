// Retur-kontekst er kun en lokal Events-visning, aldrig en vilkårlig redirect.
export function eventReturnUrl(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  )
    return null;
  let url;
  try {
    url = new URL(value, "https://kinddesign.local");
  } catch {
    return null;
  }
  if (url.origin !== "https://kinddesign.local") return null;
  const params = new URLSearchParams();
  if (url.pathname === "/events/") {
    const type = eventType(url.searchParams.get("type"));
    const status = url.searchParams.get("status");
    if (type !== "Alle") params.set("type", type);
    if (["all", "upcoming", "past"].includes(status))
      params.set("status", status);
  } else if (url.pathname === "/events/kalender/") {
    const month = url.searchParams.get("month");
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(month || "")) params.set("month", month);
  } else return null;
  return url.pathname + (params.size ? "?" + params : "");
}
export function eventType(value) {
  return (
    ["Meetup", "Workshop", "Talk"].find(
      (type) => type.toLowerCase() === value?.toLowerCase(),
    ) || "Alle"
  );
}
export function updateEventLinks(root, returnTo) {
  const context = eventReturnUrl(returnTo);
  if (!context) return;
  root.querySelectorAll("[data-event-link]").forEach((link) => {
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    url.searchParams.set("returnTo", context);
    link.href = url.pathname + url.search;
  });
}
