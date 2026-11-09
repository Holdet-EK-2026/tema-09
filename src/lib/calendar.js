// RFC 5545: UTC-datoer, escaped tekst og linjer på højst 75 UTF-8-octets.
const escapeText = (value) =>
  value
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
function fold(line) {
  const encoder = new TextEncoder();
  let result = "",
    length = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (length + bytes > 75) {
      result += "\r\n ";
      length = 1;
    }
    result += character;
    length += bytes;
  }
  return result;
}
const utc = (iso) =>
  new Date(iso)
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(/\.\d{3}Z$/, "Z");
export function eventCalendar(event) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KindDesign//Events//DA",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}-kinddesign-calendar`,
    `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(event.startAt)}`,
    `DTEND:${utc(event.endAt)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.address)}`,
    `DESCRIPTION:${escapeText(event.description + "\n" + event.lumaUrl)}`,
    `URL:${event.lumaUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
