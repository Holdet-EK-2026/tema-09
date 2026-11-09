const sharp = require(
  (process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools") +
    "/node_modules/sharp",
);
const fs = require("fs");
(async () => {
  let metrics = [];
  const maps = [
    ["776-1747", "_events_", 1440],
    ["776-1817", "_om-kinddesign_", 1440],
    ["776-1873", "_kontakt_", 1440],
    ["753-1053", "_ny-her_", 1440],
    ["753-951", "_events_design-og-nye-forbindelser_", 1440],
    ["776-1915", "_events_", 390],
    ["776-1988", "_om-kinddesign_", 390],
    ["776-2047", "_kontakt_", 390],
  ];
  for (const [id, route, width] of maps) {
    let ref = `docs/qa/fase-3/references/${id}.png`,
      site = `docs/qa/fase-6/${route}-${width}.png`;
    let rmeta = await sharp(ref).metadata(),
      smeta = await sharp(site).metadata(),
      height = Math.max(rmeta.height, smeta.height);
    const r = await sharp(ref)
        .extend({ bottom: height - rmeta.height, background: "#a5b39b" })
        .removeAlpha()
        .raw()
        .toBuffer(),
      s = await sharp(site)
        .extend({ bottom: height - smeta.height, background: "#a5b39b" })
        .removeAlpha()
        .raw()
        .toBuffer();
    let total = 0,
      over = 0;
    for (let i = 0; i < r.length; i += 3) {
      let max = 0;
      for (let j = 0; j < 3; j++) {
        let d = Math.abs(r[i + j] - s[i + j]);
        total += d;
        max = Math.max(max, d);
      }
      if (max > 30) over++;
    }
    let overlay = await sharp(site)
      .extend({ bottom: height - smeta.height, background: "#a5b39b" })
      .ensureAlpha(0.5)
      .png()
      .toBuffer();
    await sharp(ref)
      .extend({ bottom: height - rmeta.height, background: "#a5b39b" })
      .composite([{ input: overlay }])
      .png()
      .toFile(`docs/qa/fase-6/overlays/${id}.png`);
    metrics.push({
      id,
      width,
      referenceHeight: rmeta.height,
      siteHeight: smeta.height,
      meanChannelDiff: total / r.length,
      pixelsAbove30Percent: (100 * over) / (width * height),
    });
  }
  fs.writeFileSync(
    "docs/qa/fase-6/visual-comparison.json",
    JSON.stringify(metrics, null, 2),
  );
  console.log(metrics);
})();
