const { chromium } = require("/tmp/kinddesign-tools/node_modules/playwright");
const AxeBuilder =
  require("/tmp/kinddesign-tools/node_modules/@axe-core/playwright").default;
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  let cases = 0;
  const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4325";
  for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "/",
      "/events/",
      "/events/kalender/",
      "/om-kinddesign/",
      "/ny-her/",
      "/kontakt/",
      "/admin/",
      "/events/from-ballet-to-technology/",
    ]) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} ${width}: overflow`,
      );
      const footer = await page
        .locator(".site-footer")
        .evaluate((e) => getComputedStyle(e).backgroundColor);
      assert.equal(footer, "rgb(114, 47, 55)");
      if (route === "/") {
        const h1 = await page.locator("#hero-title").boundingBox(),
          header = await page.locator(".site-header").boundingBox();
        if (width <= 600) {
          assert(h1.y >= header.y + header.height);
          assert(header.height <= 80);
          const toggle = page.locator(".menu-toggle");
          await toggle.click();
          assert.equal(await toggle.getAttribute("aria-expanded"), "true");
          await page.keyboard.press("Escape");
          assert.equal(await toggle.getAttribute("aria-expanded"), "false");
          assert(await toggle.evaluate((e) => e === document.activeElement));
        }
        assert.equal(
          await page
            .locator(".hero-cta")
            .evaluate((e) => getComputedStyle(e).backgroundColor),
          "rgb(114, 47, 55)",
        );
        assert.equal(
          await page
            .locator(".community-section")
            .evaluate((e) => getComputedStyle(e).backgroundColor),
          "rgb(165, 179, 155)",
        );
      }
      if (route === "/events/") {
        await page.locator('[data-status-filter="all"]').click();
        assert.equal(await page.locator(".event-card:visible").count(), 8);
        await page.locator('[data-filter="Talk"]').click();
        assert((await page.locator(".event-card:visible").count()) > 0);
      }
      if (route === "/admin/") {
        await page.locator("#admin-login").waitFor({ state: "visible" });
        assert(!(await page.locator("#admin-workspace").isVisible()));
        assert.equal(await page.locator("#admin-events li").count(), 0);
      }
      if ([390, 1440].includes(width)) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        assert.deepEqual(
          result.violations.map((x) => x.id),
          [],
          route,
        );
      }
      cases++;
    }
    if (width <= 430) {
      for (const height of [480, 600, 900]) {
        await page.setViewportSize({ width, height });
        await page.goto(base + "/");
        const h1 = await page.locator("#hero-title").boundingBox(),
          header = await page.locator(".site-header").boundingBox();
        assert(h1.y >= header.y + header.height);
      }
    }
    assert.deepEqual(errors, []);
    if (width === 390)
      await page.screenshot({
        path: "/tmp/kinddesign-final-mobile.png",
        fullPage: false,
      });
    await context.close();
  }
  const p = await browser.newPage();
  const { verifiedLumaEvents } = await import("../../src/data/luma-events.js");
  for (const event of verifiedLumaEvents) {
    const detail = await p.request.get(base + "/events/" + event.slug + "/");
    assert.equal(detail.status(), 200);
    assert((await detail.text()).includes(event.lumaUrl));
  }
  const response = await p.goto(base + "/events/does-not-exist/");
  assert.equal(response.status(), 404);
  const calendar = await p.request.get(
    base + "/kalender/from-ballet-to-technology.ics",
  );
  const tokyo = verifiedLumaEvents.find(e => e.id === "cmapoye1");
  const upcoming = Date.now() < Date.parse(tokyo.endAt);
  assert.equal(calendar.status(), upcoming ? 200 : 404);
  if (upcoming) assert((await calendar.text()).includes("BEGIN:VCALENDAR"));
  await browser.close();
  console.log({
    responsiveCases: cases,
    mobileHeights: 12,
    adminAnonymous: true,
    axeScans: 16,
    missingEvent404: true,
    dynamicICS: true,
  });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
