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
          await page
            .locator("header")
            .screenshot({
              path: `${folder}/header-${route === "/" ? "home" : route.replaceAll("/", "_")}-${width}.png`,
            });
      }
      await page.close();
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
