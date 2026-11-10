const { chromium } = require(
  (process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools") +
    "/node_modules/playwright",
);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4321";
const folder =
  process.env.KINDDESIGN_QA_OUTPUT || "docs/qa/implementation-2026-11-10/after";
const stage = process.env.KINDDESIGN_QA_STAGE || "all";
fs.mkdirSync(folder, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const results = [];
  try {
    for (const width of [
      320, 375, 390, 430, 601, 640, 768, 1024, 1440, 1441, 1536, 1600, 1920,
      2560,
    ]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      for (const route of [
        "/",
        "/events/",
        "/om-kinddesign/",
        "/ny-her/",
        "/kontakt/",
      ]) {
        await page.goto(base + route);
        await page.evaluate(() => document.fonts.ready);
        const data = await page.evaluate(() => {
          const header = document.querySelector("header");
          const nav = [...header.querySelectorAll("nav")].find(
            (n) => n.getBoundingClientRect().width,
          );
          const rect = (n) => {
            const r = n.getBoundingClientRect();
            return {
              x: r.x,
              y: r.y,
              right: r.right,
              bottom: r.bottom,
              width: r.width,
              height: r.height,
            };
          };
          const active = [...nav.querySelectorAll('[aria-current="page"]')].map(
            (n) => {
              let parent = n,
                background;
              while (parent) {
                const bg = getComputedStyle(parent).backgroundColor;
                if (bg !== "rgba(0, 0, 0, 0)") {
                  background = bg;
                  break;
                }
                parent = parent.parentElement;
              }
              const color = getComputedStyle(n).color;
              const lum = (c) => {
                const rgb = c
                  .match(/[\d.]+/g)
                  .slice(0, 3)
                  .map((n) => Number(n) / 255)
                  .map((n) =>
                    n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4,
                  );
                return rgb.reduce(
                  (v, n, i) => v + n * [0.2126, 0.7152, 0.0722][i],
                  0,
                );
              };
              const a = lum(color),
                b = lum(background);
              return {
                text: n.innerText,
                color,
                background,
                ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
              };
            },
          );
          return {
            width: innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            logo: rect(header.querySelector(".brand")),
            nav: rect(nav),
            links: [...nav.querySelectorAll("a")].map(rect),
            active,
          };
        });
        assert(
          data.scrollWidth <= width,
          `${route} ${width}: overflow ${data.scrollWidth}`,
        );
        for (const link of data.links) {
          assert(
            link.x >= 0 && link.right <= width + 0.1,
            `${route} ${width}: clipped link`,
          );
          if (width > 600)
            assert(
              link.x >= data.logo.right - 0.1,
              `${route} ${width}: logo overlap`,
            );
        }
        data.active.forEach((n) =>
          assert(n.ratio >= 4.5, `Active contrast: ${n.ratio}`),
        );
        results.push({
          test: "header-and-active-contrast",
          route,
          width,
          ...data,
        });
        if ([390, 1440, 1920, 2560].includes(width))
          await page.locator("header").screenshot({
            path: `${folder}/header-${route === "/" ? "home" : route.replaceAll("/", "_")}-${width}.png`,
          });
      }
      await page.close();
    }
    if (stage !== "A") {
      for (const width of [320, 390, 768, 1440]) {
        const page = await browser.newPage({
          viewport: { width, height: 900 },
          reducedMotion: "reduce",
        });
        await page.goto(base + "/");
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({
          content:
            "* { line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important; } p {margin-bottom:2em !important;}",
        });
        const text = await page.evaluate(() => {
          const hero = document.querySelector(".hero").getBoundingClientRect();
          const countdown = document
            .querySelector(".countdown")
            .getBoundingClientRect();
          const elements = [
            ...document.querySelectorAll(
              ".hero-intro > *, .hero-event-summary > *, .countdown, .countdown > *",
            ),
          ].filter((n) => n.getBoundingClientRect().width);
          return {
            heroBottom: hero.bottom,
            countdownBottom: countdown.bottom,
            scrollWidth: document.documentElement.scrollWidth,
            elements: elements.map((n) => {
              let r = n.getBoundingClientRect();
              if (n.matches("h1")) {
                const range = document.createRange();
                range.selectNodeContents(n);
                r = range.getBoundingClientRect();
              }
              return {
                text: n.innerText,
                bottom: r.bottom,
                right: r.right,
                left: r.left,
                insideHero:
                  r.bottom <= hero.bottom + 0.5 &&
                  r.left >= -0.5 &&
                  r.right <= innerWidth + 0.5,
                insideCountdown:
                  !n.parentElement.matches(".countdown") ||
                  (r.bottom <= countdown.bottom + 0.5 &&
                    r.right <= countdown.right + 0.5),
              };
            }),
          };
        });
        assert(text.scrollWidth <= width, "Text spacing overflow " + width);
        text.elements.forEach((n) =>
          assert(
            n.insideHero && n.insideCountdown,
            `Text spacing clipped ${width}: ${n.text}`,
          ),
        );
        results.push({ test: "text-spacing", width, ...text });
        await page.screenshot({
          path: `${folder}/text-spacing-${width}.png`,
          fullPage: true,
        });
        await page.close();
      }
      for (const width of [390, 768, 1440]) {
        const page = await browser.newPage({
          viewport: { width, height: 900 },
          reducedMotion: "reduce",
        });
        let release;
        const gate = new Promise((resolve) => (release = resolve));
        await page.route("**/images/luma-*.webp", async (route) => {
          await gate;
          await route.continue();
        });
        await page.goto(base + "/events/?status=all", {
          waitUntil: "domcontentloaded",
        });
        await page.evaluate(() => document.fonts.ready);
        await page
          .locator(".event-card:visible")
          .first()
          .scrollIntoViewIfNeeded();
        const sizes = async () =>
          page.locator(".event-card").evaluateAll((nodes) =>
            nodes.map((n) => ({
              height: n.getBoundingClientRect().height,
              y: n.getBoundingClientRect().y,
              imageHeight: n.querySelector("img").getBoundingClientRect()
                .height,
            })),
          );
        const before = await sizes();
        await page.screenshot({
          path: `${folder}/covers-pending-${width}.png`,
        });
        release();
        await page.evaluate(async () => {
          document
            .querySelectorAll("img")
            .forEach((n) => (n.loading = "eager"));
          await Promise.all(
            [...document.images].map((n) => n.decode().catch(() => {})),
          );
        });
        const after = await sizes();
        assert.deepEqual(
          after,
          before,
          "Cover load changes card geometry " + width,
        );
        results.push({ test: "delayed-cover-stability", width, before, after });
        await page.screenshot({
          path: `${folder}/covers-decoded-${width}.png`,
        });
        await page.close();
      }
    }
    if (["C", "all"].includes(stage)) {
      for (const width of [390, 768, 1440]) {
        const context = await browser.newContext({
          viewport: { width, height: width === 390 ? 844 : 900 },
          reducedMotion: "reduce",
        });
        const page = await context.newPage();
        await page.goto(base + "/events/");
        assert.equal(await page.locator(".event-card:visible").count(), 1);
        assert.equal(
          await page.locator("[data-events-heading]").innerText(),
          "Kommende events",
        );
        const counts = {
          Alle: { all: 8, upcoming: 1, past: 7 },
          Meetup: { all: 6, upcoming: 0, past: 6 },
          Workshop: { all: 1, upcoming: 0, past: 1 },
          Talk: { all: 1, upcoming: 1, past: 0 },
        };
        for (const type of Object.keys(counts))
          for (const date of ["all", "upcoming", "past"]) {
            await page.locator(`[data-filter="${type}"]`).click();
            await page.locator(`[data-status-filter="${date}"]`).click();
            assert.equal(
              await page.locator(".event-card:visible").count(),
              counts[type][date],
              `${type}/${date}`,
            );
            assert.equal(
              await page.locator("[data-event-empty]").isVisible(),
              counts[type][date] === 0,
            );
            assert.equal(
              await page
                .locator(`[data-status-filter="${date}"]`)
                .getAttribute("aria-pressed"),
              "true",
            );
            assert(
              (
                await page.locator("[data-filter-status]").innerText()
              ).startsWith(String(counts[type][date])),
            );
          }
        const filtered = "/events/?type=Talk&status=upcoming";
        await page.goto(base + filtered);
        await page.locator(".event-card:visible .event-card-link").click();
        await page.waitForLoadState("load");
        assert.equal(
          new URL(page.url()).searchParams.get("returnTo"),
          filtered,
        );
        assert.equal(
          await page.locator(".back-link").getAttribute("href"),
          filtered,
        );
        await page.reload();
        assert.equal(
          await page.locator(".back-link").getAttribute("href"),
          filtered,
        );
        await page.locator(".back-link").click();
        assert.equal(page.url(), base + filtered);
        assert.equal(await page.locator(".event-card:visible").count(), 1);
        await page.locator(".event-card:visible .event-card-link").click();
        await page.goBack();
        assert.equal(page.url(), base + filtered);
        await page.goto(base + "/events/kalender/?month=2025-12");
        assert.equal(
          await page.locator("#calendar-month").inputValue(),
          "2025-12",
        );
        await page
          .locator("[data-calendar-month]:visible .has-event a")
          .first()
          .click();
        await page.waitForLoadState("load");
        assert.equal(
          await page.locator(".back-link").getAttribute("href"),
          "/events/kalender/?month=2025-12",
        );
        await page.locator(".back-link").click();
        await page.waitForLoadState("load");
        assert.equal(
          await page.locator("#calendar-month").inputValue(),
          "2025-12",
        );
        await page.goto(base + "/events/kalender/");
        const month = await page
            .locator(".calendar-month-control")
            .boundingBox(),
          grid = await page
            .locator("[data-calendar-month]:visible .calendar-grid")
            .boundingBox();
        assert(
          month.y + month.height < page.viewportSize().height,
          "Month selector below fold",
        );
        assert(grid.y < page.viewportSize().height - 30, "Grid below fold");
        results.push({ test: "calendar-first-viewport", width, month, grid });
        await page.screenshot({
          path: `${folder}/calendar-first-${width}.png`,
        });
        await page.goto(base + "/events/?status=all");
        assert.equal(await page.locator(".event-list a").count(), 8);
        assert.equal(await page.locator(".event-list a a").count(), 0);
        await page.locator(".event-card-link").first().focus();
        await page.keyboard.press("Tab");
        assert.equal(
          await page
            .locator(".event-card-link")
            .nth(1)
            .evaluate((n) => n === document.activeElement),
          true,
        );
        const name = await page
          .locator(".event-card-link")
          .first()
          .getAttribute("aria-labelledby");
        assert(await page.locator("#" + name).innerText());
        await page.goto(base + "/events/from-ballet-to-technology/");
        assert.equal(
          await page.locator(".back-link").getAttribute("href"),
          "/events/",
        );
        for (const invalid of [
          "https://example.com",
          "//example.com",
          "/contact/",
          "/\\example.com",
        ]) {
          await page.goto(
            base +
              "/events/from-ballet-to-technology/?returnTo=" +
              encodeURIComponent(invalid),
          );
          assert.equal(
            await page.locator(".back-link").getAttribute("href"),
            "/events/",
          );
        }
        await page.clock.install({ time: new Date("2026-11-14T12:00:00Z") });
        await page.goto(base + "/events/");
        assert.equal(await page.locator(".event-card:visible").count(), 0);
        assert(
          (await page.locator("[data-event-empty] h3").innerText()).includes(
            "ingen verificerede kommende",
          ),
        );
        await page.locator("[data-show-past]").click();
        assert.equal(await page.locator(".event-card:visible").count(), 8);
        results.push({
          test: "events-filters-context-and-keyboard",
          width,
          filterCombinations: 12,
          defaultUpcoming: true,
          contextBackAndReload: true,
          calendarContext: true,
          singleLinks: 8,
          externalReturnRejected: true,
          expiredArchiveFallback: true,
        });
        await context.close();
      }
      const noJS = await browser.newPage({
        javaScriptEnabled: false,
        viewport: { width: 390, height: 844 },
      });
      await noJS.goto(base + "/events/");
      assert.equal(await noJS.locator(".event-card:visible").count(), 8);
      results.push({ test: "events-no-JS", allEightEventsVisible: true });
      await noJS.close();
    }
    fs.writeFileSync(
      `${folder}/refinement-${stage}.json`,
      JSON.stringify(results, null, 2),
    );
    console.log("Refinement checks passed:", results.length);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
