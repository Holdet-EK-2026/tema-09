const { chromium } = require((process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools") + "/node_modules/playwright");
const fs = require("fs");
const assert = require("assert/strict");
const out = "docs/qa/header-grid-2026-11-11";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const rows = [];
  for (const width of [768, 1024, 1440, 1920, 2560]) {
    let baseline;
    for (const route of [
      "/",
      "/events/",
      "/om-kinddesign/",
      "/kontakt/",
      "/ny-her/",
    ]) {
      const p = await b.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto("http://127.0.0.1:4323" + route);
      await p.evaluate(() => document.fonts.ready);
      const data = await p.evaluate(() => {
        const rect = (s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        };
        return {
          logo: rect(".site-header .brand"),
          nav: rect(".desktop-navigation"),
          cta: rect(".header-cta"),
          links: [...document.querySelectorAll(".desktop-navigation a")].map(
            (a) => ({
              height: a.getBoundingClientRect().height,
              weight: getComputedStyle(a).fontWeight,
            }),
          ),
          current: [
            ...document.querySelectorAll('.site-header a[aria-current="page"]'),
          ]
            .filter((a) => a.getBoundingClientRect().width)
            .map((a) => a.getAttribute("href")),
          scrollWidth: document.documentElement.scrollWidth,
        };
      });
      assert.deepEqual(data.current, [route]);
      assert(data.scrollWidth <= width);
      assert(data.logo.x + data.logo.width < data.nav.x);
      assert(data.nav.x + data.nav.width < data.cta.x);
      assert(Math.abs(data.nav.x + data.nav.width / 2 - width / 2) < 0.1);
      assert.equal(data.logo.y + data.logo.height / 2, 58);
      assert.equal(data.cta.y + data.cta.height / 2, 58);
      assert.equal(data.nav.y + data.nav.height / 2, 58);
      assert(data.links.every((x) => x.height === 56 && x.weight === "700"));
      const geometry = { logo: data.logo, nav: data.nav, cta: data.cta };
      if (baseline) assert.deepEqual(geometry, baseline);
      baseline = geometry;
      assert.deepEqual(errors, []);
      if ([1440, 1920].includes(width))
        await p.screenshot({
          path: `${out}/${route === "/" ? "forside" : route.replaceAll("/", "_")}-${width}.png`,
          clip: { x: 0, y: 0, width, height: 116 },
        });
      rows.push({ route, width, ...data, errors });
      await p.close();
    }
  }
  await b.close();
  fs.writeFileSync(`${out}/measurements.json`, JSON.stringify(rows, null, 2));
  console.log("Header grid: 25 consistent placements passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
