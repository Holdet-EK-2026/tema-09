const root = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const { chromium } = require(root + "/node_modules/playwright");
const sharp = require(root + "/node_modules/sharp");
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4321";
const folder =
  process.env.KINDDESIGN_QA_OUTPUT || "docs/qa/implementation-2026-11-10/after";
fs.mkdirSync(folder, { recursive: true });
(async () => {
  const b = await chromium.launch({ channel: "chrome" }),
    results = [];
  try {
    for (const dpr of [1, 2])
      for (const width of [390, 768, 1440]) {
        const p = await b.newPage({
          viewport: { width, height: 900 },
          deviceScaleFactor: dpr,
          reducedMotion: "reduce",
        });
        for (const route of [
          "/",
          "/events/",
          "/om-kinddesign/",
          "/kontakt/",
          "/ny-her/",
        ]) {
          await p.goto(base + route);
          await p.evaluate(async () => {
            await document.fonts.ready;
            document
              .querySelectorAll("img")
              .forEach((n) => (n.loading = "eager"));
            await Promise.all(
              [...document.images]
                .filter((n) => n.src)
                .map((n) => n.decode().catch(() => {})),
            );
          });
          const media = await p
            .locator(
              ".hero-photo img,.page-hero > img,.welcome-card > img,.new-banner img,header .brand img",
            )
            .evaluateAll((nodes) =>
              nodes
                .filter((n) => n.getBoundingClientRect().width)
                .map((n) => {
                  const r = n.getBoundingClientRect();
                  return {
                    src: new URL(n.currentSrc).pathname,
                    width: r.width,
                    height: r.height,
                    fit: getComputedStyle(n).objectFit,
                  };
                }),
            );
          for (const image of media) {
            const file = path.join("public", image.src);
            const m = await sharp(file).metadata();
            image.sourceWidth = m.width;
            image.sourceHeight = m.height;
            image.bytes = fs.statSync(file).size;
            if (image.fit === "fill")
              assert(
                Math.abs(image.width / image.height - m.width / m.height) <
                  0.02,
                "Stretched image " + image.src,
              );
            if (route === "/events/" && image.src.includes("banner"))
              assert(image.bytes < 150000, "Banner too large");
          }
          if (route === "/events/" && width === 1440)
            assert(
              media.some((n) =>
                n.src.includes(dpr === 1 ? "banner-354" : "banner-708"),
              ),
            );
          if (route === "/" && dpr === 2 && width === 390)
            assert(media.some((n) => n.src.includes("1207b-1200")));
          results.push({ route, width, dpr, media });
          const target =
            route === "/"
              ? ".hero"
              : route === "/ny-her/"
                ? ".welcome-section"
                : ".page-hero";
          await p
            .locator(target)
            .screenshot({
              path: `${folder}/media-${route === "/" ? "home" : route.replaceAll("/", "_")}-${width}-dpr${dpr}.png`,
            });
        }
        await p.close();
      }
    fs.writeFileSync(folder + "/media.json", JSON.stringify(results, null, 2));
    console.log("Media checks passed:", results.length);
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
