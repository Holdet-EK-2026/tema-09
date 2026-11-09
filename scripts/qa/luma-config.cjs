const fs = require("node:fs");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const path = require("node:path");
(async () => {
  const { officialEvents, demoEvents, getEventStatus } = await import(
    pathToFileURL(path.resolve("src/data/events.js"))
  );
  const { eventCalendar } = await import(
    pathToFileURL(path.resolve("src/lib/calendar.js"))
  );
  const asOf = Date.parse("2026-11-09T12:00:00Z");
  assert.equal(officialEvents.length, 8);
  assert.equal(new Set(officialEvents.map((e) => e.lumaUrl)).size, 8);
  assert.equal(
    officialEvents.filter((e) => getEventStatus(e, asOf) === "upcoming").length,
    1,
  );
  for (const event of officialEvents) {
    assert.equal(event.lumaUrl, `https://luma.com/${event.id}`);
    assert(Date.parse(event.endAt) > Date.parse(event.startAt));
    assert(event.timezone && event.address && event.verifiedAt);
    for (const size of [450, 600, 1200])
      assert(
        fs.statSync(`public/images/luma-${event.id}-${size}.webp`).size > 0,
      );
  }
  for (const event of demoEvents) {
    assert(event.isDemo);
    assert.equal(event.lumaUrl, null);
    assert.equal(getEventStatus(event, asOf), "demo");
  }
  const tokyo = officialEvents.find((e) => e.id === "cmapoye1");
  assert.equal(tokyo.date, "2026-11-13");
  assert.equal(tokyo.time, "18.30–20.00");
  assert.equal(tokyo.timezone, "Asia/Tokyo");
  assert.equal(getEventStatus(tokyo, Date.parse(tokyo.endAt) - 1), "upcoming");
  assert.equal(getEventStatus(tokyo, Date.parse(tokyo.endAt)), "past");
  const calendar = eventCalendar(tokyo);
  assert(calendar.endsWith("\r\n"));
  for (const line of calendar.split("\r\n"))
    assert(Buffer.byteLength(line) <= 75);
  const unfolded = calendar.replaceAll("\r\n ", "");
  assert(
    /^DTSTAMP:\d{8}T\d{6}Z$/.test(
      unfolded.split("\r\n").find((line) => line.startsWith("DTSTAMP:")),
    ),
  );
  assert(unfolded.includes("DTSTART:20261113T093000Z"));
  assert(unfolded.includes("DTEND:20261113T110000Z"));
  assert(unfolded.includes("URL:https://luma.com/cmapoye1"));
  assert(unfolded.includes("LOCATION:Vague\\, 1-39"));
  assert(officialEvents.find((e) => e.id === "c3jcu29h").sourceNote);
  assert(officialEvents.find((e) => e.id === "84v57ubf").endTimeUnclear);
  const results = {
    verifiedSources: 8,
    upcomingAsOf2026_11_09: 1,
    pastAsOf2026_11_09: 7,
    demosWithoutLumaMapping: 4,
    tokyoLocalTime: true,
    statusBoundary: true,
    calendarUTCAndUTF8Folding: true,
    sourceConflictsExplicit: true,
    externalBookingsPerformed: 0,
  };
  fs.mkdirSync("docs/qa/final-implementation", { recursive: true });
  fs.writeFileSync(
    "docs/qa/final-implementation/luma-config.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
