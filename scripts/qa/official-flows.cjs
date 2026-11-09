const root = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const { chromium } = require(root + "/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const results = [];
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    let bookings = 0;
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route("https://luma.com/**", (route) => {
      bookings++;
      return route.abort();
    });
    await page.goto("http://127.0.0.1:4321/");
    await page.locator(".hero-cta").click();
    await page.waitForURL("**/events/");
    assert.equal(await page.locator(".event-card:visible").count(), 8);
    await page.locator('[data-status-filter="upcoming"]').click();
    assert.equal(await page.locator(".event-card:visible").count(), 1);
    assert(
      (await page.locator(".event-card:visible").innerText()).includes(
        "From Ballet",
      ),
    );
    await page.locator('[data-filter="Workshop"]').click();
    assert.equal(await page.locator(".event-card:visible").count(), 0);
    assert(await page.locator("[data-event-empty]").isVisible());
    await page.reload();
    assert(await page.locator("[data-event-empty]").isVisible());
    await page.locator("[data-reset-filters]").click();
    assert.equal(await page.locator(".event-card:visible").count(), 8);
    await page.goBack();
    assert(await page.locator("[data-event-empty]").isVisible());
    await page.locator("[data-reset-filters]").click();
    await page.locator('[data-status-filter="past"]').click();
    assert.equal(await page.locator(".event-card:visible").count(), 7);
    await page.locator('[data-status-filter="upcoming"]').click();
    await page.locator(".event-card:visible h3 a").click();
    await page.waitForURL("**/events/from-ballet-to-technology/");
    assert.equal(
      await page.locator("[data-luma-register]").getAttribute("href"),
      "https://luma.com/cmapoye1",
    );
    assert(
      (await page.locator(".official-facts").innerText()).includes(
        "Asia/Tokyo",
      ),
    );
    assert(
      (await page.locator(".official-facts").innerText()).includes(
        "18.30–20.00",
      ),
    );
    const download = page.locator("[data-calendar-download]");
    const response = await context.request.get(
      new URL(await download.getAttribute("href"), page.url()).href,
    );
    assert.equal(response.status(), 200);
    const ics = await response.text();
    assert(ics.includes("DTSTART:20261113T093000Z"));
    assert(ics.includes("DTEND:20261113T110000Z"));
    // Verificér selve afgangen uden at kontakte Luma eller gennemføre en reservation.
    let destination;
    await page.route("https://luma.com/cmapoye1", (route) => {
      destination = route.request().url();
      return route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Lokal testdestination</title><p>Ingen booking udført.</p>",
      });
    });
    await page.locator("[data-luma-register]").click();
    await page.waitForURL("https://luma.com/cmapoye1");
    assert.equal(destination, "https://luma.com/cmapoye1");
    await page.goto("http://127.0.0.1:4321/events/ai-skillsharing/");
    assert.equal(await page.locator("[data-luma-register]").count(), 0);
    assert.equal(await page.locator("[data-calendar-download]").count(), 0);
    assert(
      (await page.locator(".event-ended-note").innerText()).includes(
        "afsluttet",
      ),
    );
    await page.goto("http://127.0.0.1:4321/events/real-talk/");
    assert((await page.locator(".source-note").innerText()).includes("2025"));
    await page.goto("http://127.0.0.1:4321/events/meetup-berlin/");
    assert((await page.locator(".source-note").innerText()).includes("19.30"));
    assert(
      !(await page.locator(".official-facts").innerText()).includes(
        "18.30–19.30",
      ),
    );
    await page.goto("http://127.0.0.1:4321/events/kalender/");
    assert.equal(
      await page
        .locator("[data-calendar-month]:visible")
        .getAttribute("data-calendar-month"),
      "2026-11",
    );
    const cell = page.locator("[data-calendar-month]:visible .has-event a");
    assert.equal(await cell.count(), 1);
    assert((await cell.getAttribute("href")).includes("from-ballet"));
    await page.locator("#calendar-month").selectOption("2026-10");
    assert(
      (
        await page
          .locator("[data-calendar-month]:visible .has-event a")
          .getAttribute("href")
      ).includes("ai-skillsharing"),
    );
    await page.reload();
    assert.equal(await page.locator("#calendar-month").inputValue(), "2026-10");
    await page.goBack();
    assert.equal(await page.locator("#calendar-month").inputValue(), "2026-11");
    await page.goto("http://127.0.0.1:4321/events/from-ballet-to-technology/"); // Klientens minutkontrol testes med browserens clock på en frisk navigation.
    await page.clock.install({ time: new Date("2026-11-14T12:00:00Z") });
    await page.reload();
    assert.equal(await page.locator("[data-luma-register]").count(), 0);
    assert(await page.locator("[data-calendar-download]").isHidden());
    await page.goto("http://127.0.0.1:4321/");
    assert.equal(
      await page.locator("[data-countdown-value]").textContent(),
      "Afsluttet",
    );
    assert(
      (await page.locator(".hero-event").textContent()).includes(
        "AFHOLDT EVENT",
      ),
    );
    assert.equal(errors.length, 0);
    assert.equal(bookings, 0);
    results.push({
      width,
      filtersAndEmptyState: true,
      history: true,
      officialJourneyAndInterceptedLumaDestination: true,
      calendarMonthAndUTCDownload: true,
      pastRegistrationRemoved: true,
      conflictsVisible: true,
      expiredClientGuard: true,
      expiredHeroCountdown: true,
      externalBookings: 0,
      errors,
    });
    await context.close();
  }
  fs.writeFileSync(
    "docs/qa/final-implementation/official-flows.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
