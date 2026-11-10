const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4321";
const toolsRoot = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const { chromium } = require(toolsRoot + "/node_modules/playwright");
const AxeBuilder = require(
  toolsRoot + "/node_modules/@axe-core/playwright",
).default;
const fs = require("fs");
const assert = require("assert");
const folder = process.env.KINDDESIGN_QA_OUTPUT || "docs/qa/ux-ui-final/after";
(async () => {
  fs.mkdirSync(folder, { recursive: true });
  const b = await chromium.launch({ channel: "chrome" });
  const selected = process.env.KINDDESIGN_QA_ROUTES?.split(",");
  const reportPath = `${folder}/pages.json`;
  const report =
    selected && fs.existsSync(reportPath)
      ? JSON.parse(fs.readFileSync(reportPath, "utf8")).filter(
          (row) => !selected.includes(row.route),
        )
      : [];
  const slugs = [
    "design-og-nye-forbindelser",
    "ideer-paa-papir",
    "design-i-virkeligheden",
    "et-bord-nye-ansigter",
  ];
  const official = [
    "from-ballet-to-technology",
    "ai-skillsharing",
    "real-talk",
    "meetup-barcelona",
    "meetup-berlin",
    "meetup-cph-jul",
    "meetup-nordhavn-2025",
    "meetup-koebenhavn-september-2025",
  ];
  const routes = [
    "/",
    "/events/",
    "/events/kalender/",
    "/om-kinddesign/",
    "/ny-her/",
    "/kontakt/",
    ...official.map((slug) => `/events/${slug}/`),
    ...slugs.flatMap((slug) => [
      `/events/${slug}/`,
      `/tilmelding/${slug}/`,
      `/kalender/${slug}/`,
    ]),
    "/findes-ikke/",
  ];
  const widths = process.env.KINDDESIGN_QA_WIDTHS?.split(",").map(Number) || [
    320, 375, 390, 430, 768, 1024, 1440, 1536, 1920, 2560,
  ];
  for (const width of widths) {
    const context = await b.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    for (const route of routes) {
      if (selected && !selected.includes(route)) continue;
      const p = await context.newPage();
      const errors = [];
      const failures = [];
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("response", (r) => {
        if (r.status() >= 400 && !r.url().includes("/findes-ikke/"))
          failures.push({ url: r.url(), status: r.status() });
      });
      const response = await p.goto(base + route, {
        waitUntil: "networkidle",
      });
      await p.evaluate(async () => {
        for (
          let y = 0;
          y < document.documentElement.scrollHeight;
          y += innerHeight - 150
        ) {
          scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
        scrollTo(0, 0);
      });
      if (route === "/") {
        await p.locator(".gallery-window").scrollIntoViewIfNeeded();
        await p.waitForFunction(
          () =>
            document.querySelector("[data-carousel]").dataset.photosReady ===
            "true",
        );
        await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      }
      await p.evaluate(async () => {
        await document.fonts.ready;
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      });
      const data = await p.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        controlsClipped: (() => {
          const gallery = document.querySelector("[data-carousel]");
          if (!gallery) return false;
          const rect = gallery.getBoundingClientRect();
          return [...gallery.querySelectorAll(".carousel-tools button")].some(
            (button) => {
              const r = button.getBoundingClientRect();
              return (
                r.width > 0 &&
                (r.bottom > rect.bottom + 0.5 ||
                  r.left < rect.left - 0.5 ||
                  r.right > rect.right + 0.5)
              );
            },
          );
        })(),
        h1: document.querySelectorAll("h1").length,
        images: [...document.images]
          .filter((i) => i.getBoundingClientRect().width > 0)
          .every((i) => i.naturalWidth > 0),
        sections: [...document.querySelectorAll("main > section,footer")].map(
          (n) => ({
            name: n.className,
            top: n.getBoundingClientRect().top,
            height: n.getBoundingClientRect().height,
          }),
        ),
      }));
      let violations = [];
      if ([390, 1440].includes(width) && !route.startsWith("/kalender/")) {
        const axe = await new AxeBuilder({ page: p })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        violations = axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          targets: v.nodes.map((n) => n.target),
        }));
      }
      await p.screenshot({
        path: `${folder}/${route === "/" ? "forside" : route.replaceAll("/", "_")}-${width}.png`,
        fullPage: true,
      });
      report.push({
        route,
        width,
        status: response.status(),
        errors,
        failures,
        data,
        violations,
      });
      await p.close();
    }
    await context.close();
  }
  fs.writeFileSync(`${folder}/pages.json`, JSON.stringify(report, null, 2));
  const failed = report.filter(
    (r) =>
      r.status !== (r.route === "/findes-ikke/" ? 404 : 200) ||
      r.errors.length ||
      r.failures.length ||
      r.data.scrollWidth > r.width ||
      r.data.controlsClipped ||
      r.violations.length ||
      r.data.h1 !== 1 ||
      !r.data.images,
  );
  console.log(failed);
  assert.equal(
    failed.length,
    0,
    "Browserkontrollen fandt fejl; se pages.json.",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
