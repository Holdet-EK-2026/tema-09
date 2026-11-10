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
          page
            .locator(".event-card")
            .evaluateAll((nodes) =>
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
